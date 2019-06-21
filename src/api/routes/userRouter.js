import { Router } from 'express';
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validateBody from '../../middleware/validateBody';
import upload from '../../handlers/multer';

const userRouter = Router();
const { updateProfile } = ProfilesController;
const { verifyToken } = Auth;

userRouter.put('/', verifyToken, validateBody('updateUser'), upload.single('image'), updateProfile);

export default userRouter;
