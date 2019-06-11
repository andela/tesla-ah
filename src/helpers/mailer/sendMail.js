import dotenv from 'dotenv';
import mailer from 'nodemailer';
import template from './templates/notification';

dotenv.config();

export default async (to, action, data) => {
  const { AUTHOSHAVEN_USER, AUTHOSHAVEN_PASS } = process.env;
  const transport = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: AUTHOSHAVEN_USER,
      pass: AUTHOSHAVEN_PASS
    }
  });
  const notifier = template(data);
  const message = {
    to,
    from: `Authors Haven <${process.env.AUTHOSHAVEN_USER}>`,
    subject: notifier.subject,
    text: 'Authors Haven',
    html: `
     <div style="background:#e5eeff;width:100%;padding:20px 0;">
          <div style="max-width:760px;margin:0 auto;background:#ffffff">
          <div style="background:#266cef;padding:10px;color:#ffffff;text-align:center;font-size:34px">
          Authors Haven - Team Tesla
          </div>
          <div style="padding:20px;text-align:left;">
          ${notifier.html}
          </div>
          <br>
          <div style="padding:20px;text-align:left;">
          <b>Andela, Team Tesla - Cohort 5</b>
          </div>
          </div>
          <div style="padding:35px 10px;text-align:center;">
          Copyright, 2019<br>
            Andela, Team Tesla
          </div>
          </div>
     `,
  };

  const response = await transport.sendMail(message);
  return response;
};
