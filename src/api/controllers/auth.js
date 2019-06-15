import joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import TokenHelper from '../../helpers/Token.helper';
import Mailhelper from '../../helpers/SendMail.helper';
import HashHelper from '../../helpers/hashHelper';
import db from '../../sequelize/models/index';
import templete from '../../helpers/emailTemplete';
import Validation from '../../middleware/resetValidation';

const { User, Blacklist } = db;

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
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      dob,
      bio,
      gender
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
        token
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

  /**
   * signup controller
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async signup(res) {
    // TODO: Implement functionality
    return res.status(200).send({ status: 200 });
  }

  /**
   * RequestPasswordReset controller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @param {Function} next -Next
   * @returns {Object} The response object
   */
  static async RequestPasswordReset(req, res) {
    joi
      .validate(req.body, Validation.passwordResetShema)
      .then(() => {
        User.findAll({
          where: {
            email: req.body.email
          }
        }).then(async (response) => {
          if (response[0]) {
            const token = await jwt.sign(
              {
                userId: response[0].id,
                userName: response[0].username,
                userEmail: response[0].emial
              },
              process.env.SECRET_KEY,
              { expiresIn: 60 * 10 }
            );

            const user = response[0];
            const { firstName, lastName, email } = user.dataValues;
            const link = `${process.env.BASE_URL}/api/auth/reset/${token}`;
            const mail = {
              firstName,
              lastName,
              link,
              email
            };

            const transport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.AUTHOSHAVEN_USER,
                pass: process.env.AUTHOSHAVEN_PASS
              }
            });
            const htmlToSend = templete.getPasswordResetTemplete(
              mail.firstName,
              mail.lastName,
              mail.link
            );
            const mailOptions = {
              from: 'Authors Haven',
              to: `${mail.email}`,
              subject: ' Password Reset',
              text: 'Hello there',
              html: htmlToSend
            };
            transport.sendMail(mailOptions, async () => {
              res.status(201).send({
                status: 201,
                data: {
                  message: `Reset link sent to your email <${mail.email}>`,
                  email: `${mail.email}`,
                  token
                }
              });
            });
          } else {
            res.status(404).send({
              status: 404,
              data: { message: 'User with that email in not exist' }
            });
          }
        });
      })
      .catch(error => res.status(400).send({
        status: 400,
        error: {
          message: error.message.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
        }
      }));
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
        error: { message: 'Token is invalid or expired, Please request  another one' }
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
    joi
      .validate(req.body, Validation.applyPasswordShema)
      .then(async () => {
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
      })
      .catch(error => res.status(error.status || 400).send({
        status: error.status || 400,
        error: {
          message: error.message.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
        }
      }));
  }
}

export default AuthController;
