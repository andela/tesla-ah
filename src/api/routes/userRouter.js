import { Router } from 'express';
import ProfilesController from '../controllers/profilesController';
import Auth from '../../middleware/auth';
import validateBody from '../../middleware/validateBody';
import upload from '../../handlers/multer';
import OptController from '../controllers/optController';
import profileExists from '../../middleware/profile/profileExists';
import uploadImage from '../../middleware/profile/uploadImage';


const userRouter = Router();
const { updateProfile, deleteProfile } = ProfilesController;
const {
  optOutEmail, optOutApp, OptInApp, OptInEmail
} = OptController;
const { verifyToken, checkOwnership, checkIsAdmin } = Auth;

userRouter.post('/optinemail', verifyToken, OptInEmail);
userRouter.post('/optinapp', verifyToken, OptInApp);
userRouter.delete('/optinemail', verifyToken, optOutEmail);
userRouter.delete('/optinapp', verifyToken, optOutApp);
userRouter
  .route('/:id')
  .put(verifyToken, checkOwnership, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateBody('updateUser'), updateProfile)
  .put(verifyToken, profileExists, checkOwnership, validateBody('updateUser'), upload.single('image'), uploadImage, updateProfile)
  .delete(verifyToken, checkIsAdmin, deleteProfile);

export default userRouter;
