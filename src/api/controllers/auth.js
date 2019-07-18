import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { omit } from 'lodash';
import sequelize from 'sequelize';
import tokenHelper from '../../helpers/Token.helper';
import HashHelper from '../../helpers/hashHelper';
import db from '../../sequelize/models/index';
import verifyTemplate from '../../helpers/emailVerifyTemplate';
import template from '../../helpers/emailTemplate';
import workers from '../../workers';

const { generateToken, decodeToken } = tokenHelper;
const { User, Blacklist, Opt } = db;
const { queueEmailWorker } = workers;
const { Op } = sequelize;

dotenv.config();

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
    let { body } = req;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'No data sent'
      });
    }

    body = await omit(body, ['roles']);

    const userObject = {
      ...body,
      password: HashHelper.hashPassword(body.password),
      verified: false
    };

    const newUser = await User.create(userObject);

    if (newUser) {
      const token = await generateToken({
        ...newUser.dataValues,
        password: null,
      });

      await Opt.create({
        userId: newUser.id,
        type: 'email'
      });

      await Opt.create({
        userId: newUser.id,
        type: 'inapp'
      });

      const htmlToSend = verifyTemplate.sendVerification(`${newUser.firstName} ${newUser.lastName}`, newUser.email, token);

      queueEmailWorker({ email: newUser.email }, htmlToSend, 'Welcome to Authorshaven', null);

      res.status(201).send({
        status: 201,
        data: {
          message: 'You will reveive an account verification email shortly',
          email: `${newUser.email}`,
          token
        },
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
      const user = await decodeToken(token);
      await User.update(
        {
          verified: true
        },
        {
          where: {
            email: user.email
          }
        }
      );
      res.status(202).json({
        status: 202,
        message: 'Account is now verified!'
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        error: `Invalid Request ${err}`
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
    const {
      user: { id },
      token
    } = req;

    const { exp } = await decodeToken(token);

    await Blacklist.create({
      userId: id,
      token,
      expiresAt: exp * 1000,
    });

    res.json({
      status: 200,
      message: 'You are now signed out!'
    });
  }

  /**
  * signup controller
  * @param {Object} req - Response
  * @param {Object} res - Response
  * @param {Function} next -Next
  * @returns {Object} The response object
  */
  static async login(req, res) {
    const { email } = req.body;
    const users = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: email }]
      }
    });
    if (users) {
      if (
        !HashHelper.comparePassword(req.body.password, users.dataValues.password)
      ) {
        res.status(400).send({
          status: 400,
          error: {
            message: 'Incorrect password'
          }
        });
      } else {
        generateToken({
          ...users.dataValues,
          password: null,
        }).then((token) => {
          res.status(200).send({
            status: 200,
            data: {
              message: 'User logged in successful',
              token
            }
          });
        });
      }
    } else {
      res.status(404).send({
        status: 404,
        error: {
          message: 'User with that email does not exist.'
        }
      });
    }
  }

  /**
   * RequestPasswordReset controller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async RequestPasswordReset(req, res) {
    User.findAll({
      where: {
        email: req.body.email
      }
    }).then(async (response) => {
      if (response[0]) {
        const token = await generateToken({
          userId: response[0].id,
          userName: response[0].username,
          userEmail: response[0].email
        });

        const user = response[0];
        const { firstName, lastName, email } = user.dataValues;
        const link = `${process.env.BASE_URL}/api/auth/reset/${token}`;
        const mail = {
          firstName, lastName, link, email
        };
        const htmlToSend = template.getPasswordResetTemplete(
          mail.firstName,
          mail.lastName,
          mail.link
        );

        queueEmailWorker(mail, htmlToSend, 'Password Reset', null);

        return res.status(201).send({
          status: 201,
          data: {
            message: `A reset link will be sent to <${mail.email}> shortly.`,
            email: `${mail.email}`,
            token
          }
        });
      }

      return res.status(404).send({
        status: 404,
        data: { message: 'User with that email in not exist' }
      });
    });
  }

  /**
   * ConfirmPasswordReset controller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async ConfirmPasswordReset(req, res) {
    try {
      const { token } = req.params;
      const user = await jwt.verify(token, process.env.SECRET_KEY);
      const aprvToken = await jwt.sign(
        {
          userId: user.userId,
          userName: user.userName
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 10 }
      );
      const link = `${process.env.BASE_URL}/api/auth/reset/${aprvToken}`;
      res.status(200).send({
        status: 200,
        data: {
          message: 'Below is your reset link',
          link,
          token: aprvToken
        }
      });
    } catch (error) {
      res.status(error.status || 500).send({
        status: error.status || 500,
        error: {
          message: 'Token is invalid or expired, Please request  another one'
        }
      });
    }
  }

  /**
   * ApplyPasswordReset cotroller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async ApplyPasswordReset(req, res) {
    const { aprvToken } = req.params;
    const token = await jwt.verify(aprvToken, process.env.SECRET_KEY);
    const password = HashHelper.hashPassword(req.body.newpassword);
    User.update(
      {
        password
      },
      {
        where: {
          id: token.userId
        }
      }
    )
      .then(() => {
        res.status(201).send({
          status: 201,
          data: { message: 'Password changed successful' }
        });
      });
  }
}
export default AuthController;
