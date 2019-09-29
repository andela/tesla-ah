import db from '../../sequelize/models';
import sendMail from '../mailer/SendAnyEmail';
import eventEmitter from './EventEmitter';

const { Notification, Opt, User } = db;

const notify = async (data) => {
  let inAppNotification = {};
  let emailNotification = {};

  const {
    resource, user, inAppMessage, emailMessage, comment
  } = data;
  const optedin = await Opt.findAll({
    where: {
      userId: user.id
    }
  });
  optedin.map(async (subscription) => {
    const { dataValues } = await User.findOne({
      where: {
        id: user.id
      }
    });
    const url = `/articles/${comment.slug}`;
    const { email } = dataValues;
    switch (subscription.type) {
      case 'email':
        await sendMail({ email }, emailMessage, 'notification');
        emailNotification = await Notification.create({
          userId: user.id,
          resource,
          message: emailMessage,
          type: subscription.type,
          status: 'unread',
          url
        });
        break;
      case 'inapp':
        inAppNotification = await Notification.create({
          userId: user.id,
          resource,
          message: inAppMessage,
          type: subscription.type,
          status: 'unread',
          url
        });
        eventEmitter.emit('new_inapp', inAppMessage, dataValues);
        break;
      default:
        break;
    }
  });
  const response = {
    inAppNotification,
    emailNotification
  };
  return response;
};

export default notify;
