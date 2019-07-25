import optOut from '../../helpers/subscriptions/OPtOut';

/**
 * @class
 */
class OptOut {
  /**
   * @description User should be able to opt-out in-app notifications
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Object} Response object
   */
  static async optOutApp(req, res) {
    const { id } = req.user;
    optOut({
      userId: id,
      type: 'inapp'
    });
    res.json({
      message: 'You are now unsubscribed from receiving inapp notifications'
    });
  }

  /**
   * @description User should be able to opt-out email notifications
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Object} Response object
   */
  static async optOutEmail(req, res) {
    const { id } = req.user;
    optOut({
      userId: id,
      type: 'email'
    });

    return res.json({
      message: 'You are now unsubscribed from receiving email notifications!'
    });
  }
}

export default OptOut;
