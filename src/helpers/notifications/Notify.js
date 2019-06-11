import db from '../../sequelize/models';
import sendMail from '../mailer/SendAnyEmail';
import eventEmitter from './EventEmitter';
import notificationTemplate from '../mailer/templates/Notification.template';

const { Notification, Opt, User } = db;

const notify = async (data) => {
  let inAppNotification = {};
  let emailNotification = {};

  const {
    resource, user, inAppMessage, emailMessage
  } = data;
  const optedin = await Opt.findAll({
    where: {
      userId: user.followerId
    }
  });
  optedin.map(async (subscription) => {
    const { dataValues } = await User.findOne({
      where: {
        id: user.userId
      }
    });
    switch (subscription.type) {
      case 'email':
        emailNotification = await Notification.create({
          userId: user.userId,
          resource,
          message: emailMessage,
          type: subscription.type
        });
        await sendMail({ lastName: dataValues.lastName, email: dataValues.email }, notificationTemplate({ lastName: dataValues.lastName, message: emailMessage }), 'AuthorsHaven - Notification');
        break;
      case 'inapp':
        inAppNotification = await Notification.create({
          userId: user.userId,
          resource,
          message: inAppMessage,
          type: subscription.type
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
