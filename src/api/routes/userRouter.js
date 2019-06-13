import { Router } from 'express';
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validateBody from '../../middleware/validateBody';

const userRouter = Router();
const { updateProfile } = ProfilesController;
const { verifyToken } = Auth;

userRouter.put('/', verifyToken, validateBody('updateUser'), updateProfile);

export default userRouter;
