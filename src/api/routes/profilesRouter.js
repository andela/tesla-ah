import { Router } from 'express';
// eslint-disable-next-line import/no-named-as-default
import ProfilesController from '../controllers/profiles';
import Auth from '../../middleware/auth';
import validUser from '../../middleware/validUser';
import notificationsController from '../controllers/notificationsController';

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
const {
  getUnreadNotifications, getUnreadNotificationsCount,
  readNotification
} = notificationsController;

profilesRouter.get('/:username/following', following);
profilesRouter.get('/:username/followers', followers);

profilesRouter.get('/', getAllProfile);
profilesRouter.get('/:username', getProfile);
profilesRouter.patch('/:username/follow', verifyToken, userNameExist, follow);
profilesRouter.patch(
  '/:username/unfollow',
  verifyToken,
  userNameExist,
  unfollow
);
profilesRouter.get('/:username/notifications', verifyToken, getUnreadNotifications);
profilesRouter.get('/:username/notifications/count', verifyToken, getUnreadNotificationsCount);
profilesRouter.get('/:username/notifications/:id', verifyToken, readNotification);

export default profilesRouter;
