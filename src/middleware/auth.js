import authHelper from '../api/helpers/Token.helper';
import db from '../../models';

const { users } = db;
/**
 * @class Auth
 * @description Authentication based class
 *  */
class Auth {
  /**
   * Verify token middleware
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  async verifyToken(req, res, next) {
    this.bearerToken = req.headers.authorization;
    const token = this.bearerToken.split(' ')[1];
    if (!token) {
      return res.status(400).send({
        status: 400,
        error: 'Token is not provided'
      });
    }
    authHelper
      .decodeToken(token)
      .then((user) => {
        users
          .findAll({
            where: {
              id: user.userId
            }
          })
          .then((result) => {
            if (!result[0]) {
              return res.status(404).send({
                status: 404,
                error: { message: 'The token you provided is invalid' }
              });
            }
            req.user = user;
            next();
          });
      })
      .catch(error => res.status(400).send({
        status: 400,
        error
      }));
  }
}
export default new Auth();
