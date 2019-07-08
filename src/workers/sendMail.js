/* eslint-disable no-console */
import 'regenerator-runtime';
import { forEach } from 'lodash';
import models from '../sequelize/models';
import sendMail from '../helpers/mailer/SendAnyEmail';

const { Emails } = models;

const sendMailsInQueue = async () => {
  console.log(`PID: ${process.pid} === SENDING EMAILS ===`);
  const mailsToSend = await Emails.findAll({ where: { sent: false } });

  forEach(mailsToSend, async (mailItem) => {
    sendMail(mailItem.mail, mailItem.html, mailItem.subject);
    await Emails.update(
      {
        sent: true
      },
      {
        where: {
          id: mailItem.id
        }
      }
    );
  });
};

module.exports = sendMailsInQueue;
