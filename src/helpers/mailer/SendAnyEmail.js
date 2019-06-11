import dotenv from 'dotenv';
import mailer from './Mail.config';

dotenv.config();

const sendEmail = async (mail, htmlToSend, subject) => {
  const mailOptions = {
    from: 'Authors Haven',
    to: `${mail.email}`,
    subject,
    text: '',
    html: htmlToSend
  };

  mailer.sendMail(mailOptions, async () => true);
};

export default sendEmail;
