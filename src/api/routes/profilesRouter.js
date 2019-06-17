import { Router } from 'express';
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import usernameExists from '../../middleware/checkUsernameExist';

const { verifyToken } = Auth;
const { usernameExist } = usernameExists;
const profilesRouter = Router();
const {
  getProfile,
  follow,
  unfollow,
  followers,
  following,
  getAllProfile
} = ProfilesController;

profilesRouter.get(
  '/following',
  verifyToken,
  following
);
profilesRouter.get('/followers', verifyToken, followers);

profilesRouter.get('/', getAllProfile);
profilesRouter.get('/:username', getProfile);
profilesRouter.patch('/:username/follow', verifyToken, usernameExist, follow);
profilesRouter.patch(
  '/:username/unfollow',
  verifyToken,
  usernameExist,
  unfollow
);

export default profilesRouter;
