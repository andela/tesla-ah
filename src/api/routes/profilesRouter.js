import { Router } from 'express';
import ProfilesController from '../controllers/profiles';

const profilesRouter = Router();
const { getProfile, getAllProfile } = ProfilesController;

profilesRouter.get('/', getAllProfile);
profilesRouter.get('/:username', getProfile);

export default profilesRouter;
