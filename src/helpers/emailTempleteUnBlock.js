/**
 * @class ResetPassword
 * @description Authentication based class
 *  */
class TemplateUnblock {
/**
  * Verify token middleware
  * @param {String} lastname - Request
  * @param {string} link - Article link
  * @returns {String} The response String
  */
  static articleUnBlockedTemplate(lastname, link) {
    return `
    <div style="background:#e5eeff;width:100%;padding:20px 0;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff">
    <div style="background:#303346;padding:10px;color:#ffffff;text-align:center;font-size:34px">
    Authors Haven
    </div>
    <div style="padding:20px;text-align:left;">
    <p>
    <h2>Dear ${lastname} </h2></br>
    Congratulation!! Your article is unblocked on our site, you can visit your article here ${link} </br>
    </br>
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

export default TemplateUnblock;
