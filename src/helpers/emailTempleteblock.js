/**
 * @class ResetPassword
 * @description Authentication based class
 *  */
class Template {
/**
  * Verify token middleware
  * @param {String} lastname - Request
  * @param {String} token -EmailTemplate
  * @returns {String} The response String
  */
  static articleBlockedTemplate(lastname) {
    return `
    <div style="background:#e5eeff;width:100%;padding:20px 0;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff">
    <div style="background:#303346;padding:10px;color:#ffffff;text-align:center;font-size:34px">
    Authors Haven
    </div>
    <div style="padding:20px;text-align:left;">
    <p>
    <h2>Dear ${lastname} </h2></br>
    Your article is blocked on our site because it doesn't follow our terms and conditions </br>
    </br>
    If you feel it's just a mistake, you can contact administrator 
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
