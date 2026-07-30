import Joi from 'joi'
import { GET_DB } from '../config/mongodb.js'

const OTP_COLLECTION_NAME = 'email_otps'

const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  otp: Joi.string().length(6).required(),
  attempts: Joi.number().default(0),
  expiresAt: Joi.date().timestamp('javascript').required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await OTP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Tạo TTL index để Mongo tự xoá OTP hết hạn — gọi 1 lần lúc server khởi động
const ensureIndexes = async () => {
  await GET_DB().collection(OTP_COLLECTION_NAME).createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  )
}

const upsertOtp = async (email, otp, expiresAt) => {
  const validData = await validateBeforeCreate({ email, otp, expiresAt })
  return await GET_DB().collection(OTP_COLLECTION_NAME).findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { ...validData, attempts: 0 } },
    { upsert: true, returnDocument: 'after' }
  )
}

const findByEmail = async (email) => {
  return await GET_DB().collection(OTP_COLLECTION_NAME).findOne({ email: email.toLowerCase() })
}

const incrementAttempts = async (email) => {
  await GET_DB().collection(OTP_COLLECTION_NAME).updateOne(
    { email: email.toLowerCase() },
    { $inc: { attempts: 1 } }
  )
}

const deleteByEmail = async (email) => {
  await GET_DB().collection(OTP_COLLECTION_NAME).deleteOne({ email: email.toLowerCase() })
}

export const otpModel = {
  OTP_COLLECTION_NAME,
  ensureIndexes,
  upsertOtp,
  findByEmail,
  incrementAttempts,
  deleteByEmail
}