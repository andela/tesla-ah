/* eslint-disable no-console */
import 'regenerator-runtime';
import models from '../sequelize/models';

const { Emails } = models;

module.exports = async (emailObject, html, subject) => {
  console.log(`PID: ${process.pid} === QUEING EMAIL ===`);
  await Emails.create({
    mail: emailObject,
    html,
    subject,
    sent: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log(`PID: ${process.pid} === FINISHED QUEING EMAIL ===`);
};
