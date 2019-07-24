import sequelize from 'sequelize';
import db from '../../sequelize/models';
import Tokenizer from '../../helpers/Token.helper';

const { Chat, User, follows } = db;
const { Op } = sequelize;
/**
 * @author Rukundo Eric
 * @class chatController
 * @description this class performs chat
 */
class chatController {
  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @return {Object} - Response object
   */
  static async getUsers(req, res) {
    const { id } = req.user;
    follows
      .findAll({
        where: {
          [Op.or]: [{ userId: id }, { followerId: id }]
        },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username']
          },
          {
            model: User,
            as: 'followedUser',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username']
          }
        ]
      })
      .then((data) => {
        if (!data[0]) {
          return res.status(200).json({ message: 'you do not have any followers currently', followers: data, me: req.user });
        }
        return res.status(200).json({ followers: data, me: req.user });
      });
  }

  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async getMessages(req, res) {
    const myId = req.user.id;
    const { username } = req.params;
    const { dataValues: { id } } = await User.findOne({ where: { username } });
    Chat.findAll({
      where: {
        [Op.or]: [{
          senderId: myId,
          recieverId: id
        },
        {
          senderId: id,
          recieverId: myId
        }]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'username']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'email', 'username']
        }
      ]
    }).then((messages) => {
      res.status(200).json({
        messages
      });
    });
  }

  /**
   * @description - Get current User
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async getCurrentUser(req, res) {
    const { token } = req.query;
    try {
      const currentUser = await Tokenizer.decodeToken(token);
      res.json({
        user: currentUser
      });
    } catch (error) {
      res.status(401).json({
        error: 'Invalid token'
      });
    }
  }
}
export default chatController;
