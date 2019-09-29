import { Router } from 'express';
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validateBody from '../../middleware/validateBody';
import upload from '../../handlers/multer';
import OptController from '../controllers/optController';

const userRouter = Router();
const { updateProfile, deleteProfile, getCurrentUser } = ProfilesController;
const {
  optOutEmail, optOutApp, OptInApp, OptInEmail, OptedInApp, OptedInEmail
} = OptController;
const { verifyToken, checkOwnership, checkIsAdmin } = Auth;

userRouter.get('/', verifyToken, getCurrentUser);
userRouter.post('/optinemail', verifyToken, OptInEmail);
userRouter.post('/optinapp', verifyToken, OptInApp);
userRouter.delete('/optinemail', verifyToken, optOutEmail);
userRouter.delete('/optinapp', verifyToken, optOutApp);
userRouter
  .route('/:id')
  .put(verifyToken, checkOwnership, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateBody('updateUser'), updateProfile)
  .delete(verifyToken, checkIsAdmin, deleteProfile);

userRouter.get('/optinapp', verifyToken, OptedInApp);
userRouter.get('/optinemail', verifyToken, OptedInEmail);

export default userRouter;
