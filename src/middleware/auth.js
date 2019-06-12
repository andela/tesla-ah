import authHelper from '../api/helpers/Token.helper';
import db from '../sequelize/models';

const { User } = db;
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
        if (!user[0]) {
          return res.status(401).json({ status: 401, error: 'Token is invalid' });
        }
        req.token = token;
        req.user = user[0].dataValues;
        return next();
      } catch (error) {
        return res.status(500).json({ token: 'dfdfd' });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
