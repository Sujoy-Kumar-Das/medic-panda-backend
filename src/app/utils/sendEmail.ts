import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.authUserEmail,
      pass: config.authUserPassword,
    },
  });

  await transporter.sendMail({
    from: config.authUserEmail,
    to,
    subject,
    text: '',
    html,
  });
};
