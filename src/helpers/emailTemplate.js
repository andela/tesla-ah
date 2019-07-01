/**
 * @class ResetPassword
 * @description Authentication based class
 *  */
class Template {
/**
  * Verify token middleware
  * @param {String} firstname - Request
  * @param {String} lastname  - Response
  * @param {String} token -EmailTemplate
  * @returns {String} The response String
  */
  static getPasswordResetTemplete(firstname, lastname, token) {
    return `
    <div style="background:#e5eeff;width:100%;padding:20px 0;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff">
    <div style="background:#303346;padding:10px;color:#ffffff;text-align:center;font-size:34px">
    Authors Haven
    </div>
    <div style="padding:20px;text-align:left;">
    <p>
    <h2>Hi ${firstname} ${lastname} </h2></br>
    You Recently requested a password reset for your Authors Haven Account, Click the the Button below
    to reset it.</br>
    <form  action="${token}">
      <button style="background:#303346;padding:10px; outline: none; border:0; border-radius:10px; margin:5px;color:#ffffff;text-align:center;font-size:13px">Reset your Password</button>
    </form>
    </br>
    If you did not request a password reset please ignore this email or reply to let us know.
    This link will be expired in next 10 minutes.
    </p>
    <a href="https://andela.com">Visit Andela's website</a>
    </div>
    <br>
    <div style="padding:20px;text-align:left;">
    <b>Authors Haven</b>
    </div>
    </div>
    <div style="padding:35px 10px;text-align:center;">
    Copyright, 2019<br>
    Authors Haven 
    </div>
    </div>
      `;
  }
}

export default Template;
