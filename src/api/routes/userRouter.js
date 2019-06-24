import { Router } from 'express';
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validateBody from '../../middleware/validateBody';
import upload from '../../handlers/multer';

const userRouter = Router();
const { updateProfile, deleteProfile } = ProfilesController;
const { verifyToken, checkOwnership, checkIsAdmin } = Auth;

userRouter
  .route('/:id')
  .put(verifyToken, checkOwnership, validateBody('updateUser'), upload.single('image'), updateProfile)
  .delete(verifyToken, checkIsAdmin, deleteProfile);

export default userRouter;
