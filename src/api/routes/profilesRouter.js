import { Router } from 'express';
// eslint-disable-next-line import/no-named-as-default
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validUser from '../../middleware/validUser';

const { verifyToken } = Auth;
const { userNameExist } = validUser;
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
profilesRouter.patch('/:username/follow', verifyToken, userNameExist, follow);
profilesRouter.patch(
  '/:username/unfollow',
  verifyToken,
  userNameExist,
  unfollow
);

export default profilesRouter;
