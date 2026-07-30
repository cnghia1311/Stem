import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '../models/userModel.js'
import { env } from '../config/environment.js'
import ApiError from '../utils/ApiError.js'
import { otpModel } from '../models/otpModel.js'
import { mailer } from '../utils/mailer.js'
/**
 * Tạo cặp access token + refresh token
 */
const OTP_TTL_MS = 5 * 60 * 1000       
const OTP_RESEND_INTERVAL_MS = 60 * 1000 
const MAX_OTP_ATTEMPTS = 5

const sendOtp = async (reqBody) => {
  const email = reqBody.email.toLowerCase()
  const existingUser = await userModel.findOneByEmail(email)
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email đã được sử dụng!')
  }
  const existingOtp = await otpModel.findByEmail(email)
   if (existingOtp && existingOtp.createdAt > Date.now() - OTP_RESEND_INTERVAL_MS) {
    throw new ApiError(StatusCodes.TOO_MANY_REQUESTS, 'Vui lòng đợi ít nhất 60 giây trước khi gửi lại mã!')
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + OTP_TTL_MS
  await otpModel.upsertOtp(email, otp, expiresAt)
  await mailer.sendOtpEmail(email, otp)
  return { message: 'Mã xác thực đã được gửi tới email của bạn!' }
}
const verifyOtp = async (reqBody) => {
  const email = reqBody.email.toLowerCase()
  const otpDoc = await otpModel.findByEmail(email)
  if (!otpDoc || otpDoc.expiresAt < Date.now()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã xác thực không tồn tại hoặc đã hết hạn!')
  }
  if (otpDoc.attempts >= MAX_OTP_ATTEMPTS) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn đã nhập sai quá nhiều lần. Vui lòng gửi lại mã!')
  }
  if (otpDoc.otp !== reqBody.otp) {
    await otpModel.incrementAttempts(email)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã xác thực không đúng!')
  }
  await otpModel.deleteByEmail(email)
  const verifyToken = jwt.sign(
    { email, purpose: 'email-verify' },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  return { verifyToken }
}

const generateTokens = (userInfo) => {
  const accessToken = jwt.sign(
    { _id: userInfo._id, email: userInfo.email, role: userInfo.role, displayName: userInfo.displayName },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  const refreshToken = jwt.sign(
    { _id: userInfo._id, email: userInfo.email },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '14d' }
  )

  return { accessToken, refreshToken }
}

/**
 * Đăng ký tài khoản mới
 */
const register = async (reqBody) => {
  const email = reqBody.email.toLowerCase()
  try {
    const decoded = jwt.verify(reqBody.verifyToken, env.JWT_SECRET)
    if (decoded.purpose !== 'email-verify' || decoded.email !== email) {
      throw new Error('Token không khớp email!')
    }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email chưa được xác thực hoặc phiên xác thực đã hết hạn!')
  }
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await userModel.findOneByEmail(reqBody.email)
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email đã được sử dụng!')
  }

  // Kiểm tra tên hiển thị đã tồn tại chưa
  const existingName = await userModel.findOneByDisplayName(reqBody.displayName)
  if (existingName) {
    throw new ApiError(StatusCodes.CONFLICT, 'Tên hiển thị đã có người sử dụng!')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(reqBody.password, 10)

  // Tạo user mới
  const newUser = {
    email: reqBody.email.toLowerCase(),
    password: hashedPassword,
    displayName: reqBody.displayName
  }

  const createdUser = await userModel.createNew(newUser)
  const user = await userModel.findOneById(createdUser.insertedId.toString())

  // Tạo tokens
  const tokens = generateTokens(user)

  // Trả về user info (không trả password)
  return {
    ...tokens,
    user: {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role
    }
  }
}

/**
 * Đăng nhập
 */
const login = async (reqBody) => {
  const user = await userModel.findOneByEmail(reqBody.email)
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng!')
  }

  // So sánh password
  const isMatch = await bcrypt.compare(reqBody.password, user.password)
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng!')
  }

  // Tạo tokens
  const tokens = generateTokens(user)

  return {
    ...tokens,
    user: {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role
    }
  }
}

/**
 * Làm mới access token bằng refresh token
 */
const refreshToken = async (clientRefreshToken) => {
  try {
    const decoded = jwt.verify(clientRefreshToken, env.JWT_REFRESH_SECRET)

    const user = await userModel.findOneById(decoded._id)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found!')
    }

    // Tạo access token mới
    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Tạo refresh token mới (rotation)
    const newRefreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '14d' }
    )

    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token không hợp lệ!')
  }
}

export const authService = {
  register,
  login,
  refreshToken,
  sendOtp,
  verifyOtp
}
