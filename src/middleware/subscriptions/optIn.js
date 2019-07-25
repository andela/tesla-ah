import isOptedIn from '../../helpers/subscriptions/isOptedIn';

/**
 * @class
 */
class OptedIn {
  /**
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {Object}- Response
   */
  static async optedInEmail(req, res, next) {
    const { id } = req.user;
    if (isOptedIn(id, 'email')) {
      return res.status(400).json({
        error: 'You are already opted-in'
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
  static async optedInApp(req, res, next) {
    const { id } = req.user;
    return isOptedIn(id, 'inapp') ? res.status(400).json({
      error: 'You are already opted in'
    }) : next();
  }
}

export default OptedIn;
