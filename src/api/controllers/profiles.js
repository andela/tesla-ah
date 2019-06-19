import models from '../../sequelize/models';
import uploadHelper from '../../helpers/uploadHelper';

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
        { where: { id: user.id } },
      );
      return res.status(200).json({ user: { updatedUser } });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
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
  }
}
