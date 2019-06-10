import { Router } from 'express';
import ProfilesController from '../controllers/profiles';

const profilesRouter = Router();
const { getProfile } = ProfilesController;

profilesRouter.get('/:username', getProfile);

export default profilesRouter;
