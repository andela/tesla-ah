/* eslint-disable no-console */
import 'regenerator-runtime';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import models from '../sequelize/models';

const { User } = models;


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_ID,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadHelper = async (filePath, user) => {
  console.log(`PID: ${process.pid} === UPLOADING IMAGE ===`);
  const uploadedImage = await cloudinary.uploader.upload(filePath.path);

  await User.update({ image: uploadedImage.secure_url }, { where: { id: user } });
  console.log('=== FINISHED UPLOADING IMAGE ===');
};

module.exports = uploadHelper;
