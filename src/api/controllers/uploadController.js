import { v2 as cloudinary } from 'cloudinary';

/**
 * @Author - Deschant Kounou
 */
class uploadController {
  /**
   * Upload a single image
   * @param {Object} req - Request
   * @param {Object} res  - Response
   * @returns {Object} uploaded image url
   */
  static async uploadImage(req, res) {
    const { file } = req;
    try {
      const image = await cloudinary.uploader.upload(file.path);
      return res.status(200).json({ status: 200, url: image.secure_url });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default uploadController;
