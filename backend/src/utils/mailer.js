import nodemailer from 'nodemailer'
import { env } from '../config/environment.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
})

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"STEM Web3 Builder" <${env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Mã xác thực email của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Xác thực địa chỉ email</h2>
        <p>Mã xác thực của bạn là:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
        <p>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
      </div>
    `
  })
}

export const mailer = {
  sendOtpEmail
}
