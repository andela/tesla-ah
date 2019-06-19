import { v2 as cloudinary } from 'cloudinary';
import models from '../../sequelize/models';

const { User } = models;

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
      return res.status(404).json({ message: `User ${username} does not exist` });
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
    const { body, user, file } = req;
    let uploadedImage;

    if (file) {
      // Upload image to cloudinary
      uploadedImage = await cloudinary.uploader.upload(file.path);
    }

    try {
      const updatedUser = await User.update(
        { ...body, image: uploadedImage.secure_url || '' },
        { where: { id: user.id } },
      );

      if (!updatedUser[0]) {
        return res.status(404).json({ message: `Could not find user with id: ${user.id}` });
      }

      return res.status(200).json({ user: { updatedUser } });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }
}
