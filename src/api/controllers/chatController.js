/* eslint-disable no-undef */
import sequelize from 'sequelize';
import db from '../../sequelize/models';

const { Chat, User, follows } = db;
const { Op } = sequelize;
/**
 * @author Rukundo Eric
 * @class Chat
 * @description this class performs the whole authentication
 */
class chatController {
  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
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
          return res.status(200).json({ error: 'you do not have any followers currently' });
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
      }
    }).then((messages) => {
      res.status(200).json({
        messages
      });
    });
  }

  /**
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  static async sendMessage(req, res) {
    const myId = req.user.id;
    const { username } = req.params;
    const { message } = req.body;
    const { dataValues: { id } } = await User.findOne({ where: { username } });
    Chat.create({ message, senderId: myId, recieverId: id }).then(() => {
      res.status(201).json({
        status: 201,
        data: { message: 'Message sent' }
      });
    });
  }
}
export default chatController;
