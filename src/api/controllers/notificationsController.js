import models from '../../sequelize/models';

const { Notification } = models;

/**
 * @Author - Mireille Niwemuhuza
 */
class notificationsController {
/**
 *  @description - Users should be able to get unread notifications
 *  @param {object} req - Request object
 *  @param {object} res - Response object
 *  @return {object} - Response object
*/
  static async getUnreadNotifications(req, res) {
    const { id } = req.user;
    const unreadNotifications = await Notification.findAll({
      where: {
        userId: id,
        status: 'unread'
      }
    });
    // const { message } = unreadNotifications;
    return res.status(200).json({
      data: { unreadNotifications }

    });
  }

  /**
   *  @description - Users should be able to get unread notifications count
   *  @param {object} req - Request object
   *  @param {object} res - Response object
   *  @return {object} - Response object
  */
  static async getUnreadNotificationsCount(req, res) {
    const { id } = req.user;
    const notifications = await Notification.count({
      where: {
        userId: id,
        status: 'unread'
      }
    });

    return res.status(200).json({
      status: 200,
      data: {
        notifications
      }
    });
  }

  /**
    *  @description - Users should be able to read a notification
    *  @param {object} req - Request object
    *  @param {object} res - Response object
    *  @return {object} - Response object
   */
  static async readNotification(req, res) {
    const { id } = req.params;
    const notification = await Notification.findAll({
      where: {
        id
      }
    });
    await Notification.update(
      {
        status: 'read'
      },
      { where: { id } }
    );
    const { message } = notification[0];
    return res.status(200).json({
      status: 200,
      data: {
        message
      }
    });
  }
}
export default notificationsController;
