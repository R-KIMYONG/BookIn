import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NAVER_EMAIL,
    pass: process.env.NAVER_EMAIL_PASSWORD,
  },
});