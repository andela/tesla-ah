import { omit } from 'lodash';
import { forEach } from 'async';
import models from '../../sequelize/models';
import workers from '../../workers';

const { User, follows } = models;
const { uploadImageWorker } = workers;


/**
 * This class contains user controllers
 */
export default class ProfilesController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns an object containing the user profile
   */
  static async getProfile(req, res) {
    const { username } = req.params;

    const queryResult = await User.findAll({ where: { username } });
    if (!queryResult[0]) {
      return res
        .status(404)
        .json({ message: `User ${username} does not exist` });
    }
    const profile = queryResult[0].dataValues;

    return res.status(200).json({ profile });
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns an object containing the updated user profile
   */
  static async updateProfile(req, res) {
    let { body } = req;
    const { user, files, params } = req;

    if (!files && Object.keys(body) < 1) return res.status(400).send({ message: 'Cannot update empty object' });

    if (files && Object.keys(body) < 1) {
      uploadImageWorker(files, params.id, 'user', null);
      return res.status(200).json({ status: 200, message: 'Your image will be updated shortly' });
    }

    if (!user.roles.includes('admin')) {
      body = await omit(body, ['roles']);
    }

    const updatedProfile = { ...body };

    try {
      const updatedUser = await User.update(
        updatedProfile,
        { where: { id: params.id }, returning: true },
      );

      if (!updatedUser[0]) {
        return res
          .status(404)
          .json({ message: `Could not find user with id: ${user.id}` });
      }

      uploadImageWorker(files, params.id, 'user', null);

      return res.status(200).json({ user: updatedUser[1][0] });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns a res status with message
   */
  static async deleteProfile(req, res) {
    const { params } = req;
    try {
      await User.destroy({ where: { id: params.id } });
      return res.status(200).json({ status: 200, message: `User ${params.id} deleted.` });
    } catch (error) {
      return res.status(500).json({ status: 500, error: `${error}` });
    }
  }

  /**
   * @Author - Audace Uhiriwe
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns an object containing the user's profiles
   */
  static async getAllProfile(req, res) {
    const fetchedProfile = await User.findAll({ attributes: ['username', 'firstName', 'lastName', 'bio', 'avatar', 'cover'] });
    if (!fetchedProfile[0]) return res.status(200).send({ message: 'No Users Profiles found!', data: fetchedProfile });
    return res.status(200).send({
      profiles: fetchedProfile
    });
  }

  /**
   * @Author - Audace Uhiriwe
   * @param  {object} req
   * @param  {object} res
   * @return {object} returns an object containing the user's profiles
   */
  static async follow(req, res) {
    const { username } = req.params;
    const registeredUser = await User.findOne({ where: { username } });
    if (registeredUser.id === req.user.id) {
      return res.status(400).json({ errors: 'Sorry but you cannot follow yourself ' });
    }

    follows
      .create({
        userId: registeredUser.id,
        followerId: req.user.id
      })
      .then(response => res.status(200).json({
        response,
        message: `Congratulation, now you follow ${registeredUser.username} `
      }))
      .catch(error => (error.name === 'SequelizeUniqueConstraintError'
        ? res.status(400).send({
          error: ` ${username} is already your follower `
        })
        : res.status(500).json({ error: `${error}` })));
  }

  /**
   * Apply unfollow a user controller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} The response object
   */
  static async unfollow(req, res) {
    const [username, user] = [req.params.username, req.user];
    const registeredUser = await User.findOne({ where: { username } });

    const unfollowedUser = Object.keys(registeredUser).length
      ? await follows.destroy({
        where: {
          userId: registeredUser.id,
          followerId: user.id
        }
      })
      : null;

    if (unfollowedUser && unfollowedUser.errors) {
      return res
        .status(500)
        .json({ errors: 'Internal server error' });
    }

    return unfollowedUser
      ? res.status(200).json({
        message: `you unfollowed ${username}`,
      })
      : res
        .status(400)
        .json({ error: `you do not follow ${username}` });
  }

  /**
   * Apply function to fetch user's followers
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} followers
   */
  static async followers(req, res) {
    // find user
    const { username } = req.params;
    const user = await User.findAll({ where: { username } });

    if (!user[0]) return res.status(400).json({ message: `User ${username} does not exits` });

    follows
      .findAll({
        where: { userId: user[0].id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'avatar', 'bio']
          }
        ]
      })
      .then((data) => {
        if (!data[0]) {
          return res.status(200).json({ message: 'you do not have any followers currently', followers: data });
        }
        // Add a property to say if this user is already followed back
        forEach(data, (follower, callback) => {
          follower.dataValues.isFollowedback = false;
          follows
            .findAll({
              where: { userId: follower.followerId, followerId: user[0].id },
              include: [
                {
                  model: User,
                  as: 'followedUser',
                  attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'avatar', 'bio']
                }
              ]
            })
            .then((checkData) => {
              if (checkData[0]) {
                follower.dataValues.isFollowedback = true;
              }
              callback();
            });
        }, () => res.status(200).json({ followers: data }));
      });
  }

  /**
   * Apply function to fetch all users you follow
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} followers
   */
  static async following(req, res) {
    // find user
    const { username } = req.params;
    const user = await User.findAll({ where: { username } });

    if (!user[0]) return res.status(400).json({ message: `User ${username} does not exits` });

    follows
      .findAll({
        where: { followerId: user[0].id },
        include: [
          {
            model: User,
            as: 'followedUser',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'avatar', 'bio']
          }
        ]
      })
      .then((data) => {
        if (!data[0]) {
          return res.status(200).json({ message: 'you do not following anyone currently', following: data });
        }
        return res.status(200).json({ following: data });
      });
  }

  /**
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} user
   */
  static async getCurrentUser(req, res) {
    return res.status(200).json({ user: req.user });
  }
}
