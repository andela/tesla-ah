import workers from '../../workers';

const { uploadImageWorker } = workers;
const uploadImage = async (req, res, next) => {
  const { file, body, params } = req;
  if (file && Object.keys(body) < 1) {
    uploadImageWorker(file, params.id, null);
    return res.status(200).json({ status: 200, message: 'Your image will be updated shortly' });
  }

  next();
};

export default uploadImage;
