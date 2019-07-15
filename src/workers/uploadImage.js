/* eslint-disable no-console */
import 'regenerator-runtime';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { forEach } from 'lodash';
import { each } from 'async';
import models from '../sequelize/models';

const { User, Article } = models;


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_ID,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadHelper = async (uploads, id, model) => {
  console.log(`PID: ${process.pid} === UPLOADING IMAGE ===`);
  let uploadedImage;

  forEach(uploads, async (upload) => {
    const gallery = [];

    switch (model) {
      case 'user':
        forEach(upload, async (file) => {
          const { path, fieldname } = file;
          uploadedImage = await cloudinary.uploader.upload(path);
          await User.update({ [fieldname]: uploadedImage.secure_url }, { where: { id } });
          console.log('UPLOAD COMPLETED');
        });
        break;

      case 'article':
        each(upload, async (file, callback) => {
          const { path } = file;
          uploadedImage = await cloudinary.uploader.upload(path);
          gallery.push(uploadedImage.secure_url);
          callback();
        }, async (err) => {
          if (!err) {
            const article = await Article.findOne({ where: { id } });
            const newGallery = [...article.gallery, ...gallery];
            await Article.update({ gallery: newGallery }, { where: { id } });
            console.log('UPLOAD COMPLETED');
          }
        });
        break;

      default:
        break;
    }
  });
};

module.exports = uploadHelper;
