import isOptedIn from '../../helpers/subscriptions/isOptedIn';

/**
 * @class
 */
class OptedOut {
  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {Object}- Response
   */
  static async optedOutEmail(req, res, next) {
    const { id } = req.user;
    const isTrue = await isOptedIn(id, 'email');
    if (!isTrue) {
      return res.status(400).json({
        error: 'You are already opted-out'
      });
    }

    next();
  }

  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {Object} - Response
   */
  static async optedOutApp(req, res, next) {
    const { id } = req.user;
    const isTrue = await isOptedIn(id, 'inapp');
    return !isTrue ? res.status(400).json({
      error: 'You are already opted out'
    }) : next();
  }
}

export default OptedOut;
