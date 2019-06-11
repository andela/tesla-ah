import mailer from './Mail.config';

const sendEmail = async (mail, htmlToSend, subject) => {
  const mailOptions = {
    from: `Authors Haven<${process.env.AUTHOSHAVEN_USER}>`,
    to: `${mail.email}`,
    subject,
    text: '',
    html: htmlToSend
  };

  const res = mailer.sendMail(mailOptions, async () => true);
  return res;
};

export default sendEmail;
