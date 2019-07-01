import sendEmail from './mailer/SendAnyEmail';
import Template from './emailTemplateBlock';
import TemplateUnblock from './emailTemplateUnblock';

/**
 * @author EmyRukundo
 * @class AuthController
 * @description this class performs the whole authentication
 */
class notifyAuthor {
  /**
   *
   * @param {Object} data - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async notifyAuthorblock(data) {
    const mail = {
      lastName: data.lastName, email: data.email
    };
    const htmlToSend = Template.articleBlockedTemplate(mail.lastName);
    await sendEmail(mail, htmlToSend, 'Notification');
  }

  /**
   *
   * @param {Object} data - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async notifyAuthorUnblock(data) {
    const link = `${process.env.BASE_URL}/api/articles/${data.slug}`;
    const mailUnblock = {
      lastName: data.lastName, email: data.email
    };
    const htmlToSendU = TemplateUnblock.articleUnBlockedTemplate(mailUnblock.lastName, link);
    await sendEmail(mailUnblock, htmlToSendU, 'Congratulation');
  }
}
export default notifyAuthor;
