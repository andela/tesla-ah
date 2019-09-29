import { Router } from 'express';

import UploadController from '../controllers/uploadController';
import Auth from '../../middleware/auth';
import upload from '../../handlers/multer';

const uploadRouter = Router();
const { uploadImage } = UploadController;
const { verifyToken } = Auth;

uploadRouter.post('/image', verifyToken, upload.single('image'), uploadImage);

export default uploadRouter;
