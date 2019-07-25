import mailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTHOSHAVEN_USER,
    pass: process.env.AUTHOSHAVEN_PASS
  }
});

export default transporter;
