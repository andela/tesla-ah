import db from '../../sequelize/models';
import findUser from '../FindUser';

const { Chat } = db;

/**
 * @author Elie Mugenzi
 * @class ChatHelper
 * @description this class performs the whole authentication
 */
class ChatHelper {
  /**
   *
   * @param {Object} message - Request object
   * @returns {Object} - Response object
   */
  static async saveMessage(message) {
    const {
      sender, receiver, message: chatMessage, read
    } = message;
    const { id: senderId } = await findUser(sender);
    const infos = await findUser(receiver);

    const newChat = await Chat.create({
      senderId,
      recieverId: infos.id,
      message: chatMessage,
      read
    });
    return newChat;
  }

  /**
   *
   * @param {String} username - Request object
   * @returns {Object} - Response object
   */
  static async updateReadMessages(username) {
    const { id } = await findUser(username);
    const result = await Chat.update({
      read: true,
    }, {
      where: {
        recieverId: id,
        read: false,
      }
    });
    return result;
  }

  /**
   *
   * @param {String} username - Request object
   * @returns {Number} - Response object
   */
  static async getUnreadMessageCount(username) {
    const { id } = await findUser(username);
    const result = await Chat.count({
      where: { recieverId: id, read: false }
    });
    return result;
  }
}


export default ChatHelper;
