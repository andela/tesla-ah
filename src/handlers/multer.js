import multer from 'multer';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpeg|png|gif$i/)) {
      cb(new Error('File is not supported'), false);
    }
    cb(null, true);
  }
});
