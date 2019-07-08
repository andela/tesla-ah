import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendEmail = async (mail, htmlToSend, subject) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTHOSHAVEN_USER,
      pass: process.env.AUTHOSHAVEN_PASS
    }
  });
  const mailOptions = {
    from: 'Authors Haven',
    to: `${mail.email}`,
    subject,
    text: '',
    html: htmlToSend
  };

  transport.sendMail(mailOptions, async () => true);
};

export default sendEmail;
