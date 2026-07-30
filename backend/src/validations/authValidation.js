import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'

const register = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().min(6).max(50).trim(),
    displayName: Joi.string().required().min(2).max(50).trim(),
    verifyToken: Joi.string().required()
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const sendOtp = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase()
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const verifyOtp = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    otp: Joi.string().pattern(/^\d{6}$/).required().messages({
      'string.pattern.base': 'Mã OTP phải gồm 6 chữ số!'
    })
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().min(6).max(50).trim()
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const authValidation = {
  register,
  login,
  sendOtp,
  verifyOtp
}
