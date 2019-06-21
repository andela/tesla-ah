import { v2 as cloudinary } from 'cloudinary';

export default async (filePath, res) => {
  try {
    return await cloudinary.uploader.upload(filePath.path);
  } catch (error) {
    return res.status(error.status || 500).json({ error: `${error}` });
  }
};
