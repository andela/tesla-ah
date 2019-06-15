import db from '../../sequelize/models';
import TokenHelper from '../../helpers/Token.helper';
import Mailhelper from '../../helpers/SendMail.helper';
import HashHelper from '../../helpers/hashHelper';

const { User, Blacklist } = db;

/**
 * @author Elie Mugenzi
 * @class AuthController
 * @description this class performs the whole authentication
 */
class AuthController {
  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async register(req, res) {
    const {
      firstName, lastName, email, password, username, dob, bio, gender
    } = req.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'No data sent'
      });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: HashHelper.hashPassword(password),
      username,
      dob,
      bio,
      gender,
      verified: false
    });
    if (newUser) {
      const token = await TokenHelper.generateToken(newUser.dataValues);
      Mailhelper.sendMail({
        to: newUser.email,
        names: `${newUser.firstName} ${newUser.lastName}`,
        subject: 'Welcome to Authorshaven',
        message: 'Thank you for choosing Authorshaven',
        token
      });

      res.status(201).json({
        status: 201,
        message: 'We have sent an email to you to verify your account',
        token,
      });
    }
  }

  /**
   * Verifies account
   * @param {Object} req - Request
   * @param {*} res - Response
   * @returns {Object} - Response
   */
  static async verifyAccount(req, res) {
    const { token } = req.query;
    try {
      const user = await TokenHelper.decodeToken(token);
      await User.update({
        verified: true
      }, {
        where: {
          email: user.email
        }
      });
      res.status(202).json({
        status: 202,
        message: 'Account is now verified!'
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        error: 'Invalid Request'
      });
    }
  }

  /**
   * User should be able to sign out
   * @param {Object} req - Request object
   * @param {Object} res - Response Object
   * @returns {Object} - Response object
   */
  static async SignOut(req, res) {
    const { user: { id }, token } = req;
    const droppedToken = await Blacklist.create({
      userId: id,
      token
    });
    if (droppedToken) {
      res.json({
        status: 200,
        message: 'You are now signed Out!',

      });
    }
  }
}

export default AuthController;
