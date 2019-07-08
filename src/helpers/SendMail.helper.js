
import mailer from 'nodemailer';
import mailTemplate from './MailTemplate.helper';

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTHOSHAVEN_USER,
    pass: process.env.AUTHOSHAVEN_PASS
  }
});
/**
 * @author Elie Mugenzi
 * @class MailHelper
 * @description A helper class for sending emails
 */
class MailHelper {
  /**
   * Send mail
   * @param {Object} param0 - Object which contains email information
   * @returns {Object} Results after sending mail
   */
  static async sendMail({
    to, names, subject, message, token
  }) {
    const msg = {
      from: `Authors Haven<${process.env.AUTHOSHAVEN_USER}>`,
      to,
      subject,
      text: message,
      html: mailTemplate({ to, token, names })
    };
    const result = await transporter.sendMail(msg);
    return result;
  }
}

export default MailHelper;
