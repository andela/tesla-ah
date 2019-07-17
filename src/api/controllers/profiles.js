import { omit } from 'lodash';
import models from '../../sequelize/models';
import uploadHelper from '../../helpers/uploadHelper';

const { User, follows } = models;

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
    let uploadedImage;
    const { user, file, params } = req;

    if (!user.roles.includes('admin')) {
      body = await omit(body, ['roles']);
    }

    const updatedProfile = { ...body };

    // Upload image to cloudinary if available
    if (file) {
      uploadedImage = await uploadHelper(file);
      Object.assign(updatedProfile, { image: uploadedImage.secure_url });
    }

    try {
      if (!file && Object.keys(body) < 1) return res.status(400).send({ message: 'Nothing changed in your Profile' });
      const updatedUser = await User.update(
        updatedProfile,
        { where: { id: params.id } },
      );

      if (!updatedUser[0]) {
        return res
          .status(404)
          .json({ message: `Could not find user with id: ${user.id}` });
      }

      return res.status(200).json({ user: { updatedUser } });
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
    const fetchedProfile = await User.findAll({ attributes: ['username', 'firstName', 'lastName', 'bio', 'image'] });
    if (!fetchedProfile[0]) return res.status(200).send({ message: 'No Users Profiles found!', data: fetchedProfile });
    return res.status(200).send({
      profiles: fetchedProfile
    });
    /**
   * Apply follow a user controller
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} The response object
   */
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
      return res.status(400).json({ errors: 'You can not following yourself ' });
    }

    follows
      .create({
        userId: registeredUser.id,
        followerId: req.user.id
      })
      // eslint-disable-next-line no-unused-vars
      .then(response => res.status(200).json({
        response,
        message: `Congratulation, now you follow ${registeredUser.username} `
      }))
      .catch(error => (error.name === 'SequelizeUniqueConstraintError'
        ? res.status(400).send({
          error: ` ${username} is already your follower `
        })
        : res.status(500).json({ error: 'something went wrong' })));
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
        message: `you unfollowed ${username}`
      })
      : res
        .status(400)
        .json({ errors: `you do not follow ${username}` });
  }

  /**
   * Apply function to fetch user's followers
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} followers
   */
  static async followers(req, res) {
    // eslint-disable-next-line no-unused-vars
    const f = await follows.findAll();
    follows
      .findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username']
          }
        ]
      })
      .then((data) => {
        if (!data[0]) {
          return res.status(200).json({ error: 'you do not have any followers currently' });
        }
        return res.status(200).json({ followers: data });
      });
  }

  /**
   * Apply function to fetch all users you follow
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} followers
   */
  static async following(req, res) {
    follows
      .findAll({
        where: { followerId: req.user.id },
        include: [
          {
            model: User,
            as: 'followedUser',
            attributes: ['id', 'firstName', 'lastName', 'email', 'username']
          }
        ]
      })
      .then((data) => {
        if (!data[0]) {
          return res.status(200).json({ error: 'you do not following anyone currently' });
        }
        return res.status(200).json({ following: data });
      });
  }
}
