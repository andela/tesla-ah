import authHelper from '../helpers/Token.helper';
import db from '../sequelize/models';

const { User, Blacklist } = db;
/**
 * @class Auth
 * @description Authentication based class
 */
export default class Auth {
  /**
   * Verify token middleware
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async verifyToken(req, res, next) {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Token is missing' });
    }

    try {
      const decoded = await authHelper.decodeToken(token);
      try {
        const user = await User.findAll({ where: { id: decoded.id } });
        const blackListed = await Blacklist.findAll({ where: { token } });
        if (!user[0] || blackListed[0]) {
          return res.status(401).json({ status: 401, error: 'Token is invalid' });
        }
        req.token = token;
        req.user = user[0].dataValues;
        return next();
      } catch (error) {
        return res.status(500).json({ error: `${error}` });
      }
    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        return res.status(401).json({ status: 401, message: error.message });
      }
      return res.status(500).json({ error: `${error}` });
    }
  }

  /**
   * Check ownership
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async checkOwnership(req, res, next) {
    const { user, params } = req;
    if ((user.id === parseInt(params.id, 10)) || (user.roles.includes('admin'))) {
      return next();
    }
    return res.status(403).json({ message: 'You are not allowed to perform this operation' });
  }

  /**
   * Check checkIsAdmin
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async checkIsAdmin(req, res, next) {
    const { user } = req;
    if (user && user.roles.includes('admin')) {
      return next();
    }
    return res.status(403).json({ message: 'You are not allowed to perform this operation' });
  }

  /**
   * Check checkIsModerator
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async checkIsModerator(req, res, next) {
    const { user } = req;
    if (user.roles.includes('moderator') || user.roles.includes('admin')) {
      return next();
    }
    return res.status(403).send({
      status: 403,
      data: {
        message: 'You are not allowed to perform this operation',
      },
    });
  }
}
