import Sequelize from 'sequelize';
import userModel from '../models/users';
import dbConnection from './db/index';
import authHelper from '../api/helpers/Token.helper';

class Auth extends dbConnection {
  async verifyToken(req, res, next) {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    if (!token) {
      return res.status(400).send({
        status: 400,
        error: 'Token is not provided'
      });
    }
    authHelper.decodeToken(token).then((userid) => {
      userModel(this.getConnection(), Sequelize)
        .findAll({
          where: {
            id: userid
          }
        })
        .then((result) => {
          if (!result[0]) {
            return res.status(400).send({
              status: 400,
              error: { message: 'The token you provided is invalid' }
            });
          }
          req.user = { userId: result[0].id };
          next();
        });
    });
  }
}
export default Auth;
