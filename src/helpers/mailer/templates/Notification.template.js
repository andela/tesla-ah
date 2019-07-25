

const notificationTemplate = ({ lastName, message }) => `
    <div style="background:#e5eeff;width:100%;padding:20px 0;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff">
    <div style="background:#303346;padding:10px;color:#ffffff;text-align:center;font-size:34px">
    Authors Haven
    </div>
    <div style="padding:20px;text-align:left;">
    <p>
    <h2>Dear ${lastName} </h2></br>
    ${message}
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

export default notificationTemplate;
