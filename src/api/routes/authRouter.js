import { Router } from 'express';
import authController from '../controllers/auth';
import validateBody from '../../middleware/validateBody';
import userValidation from '../../middleware/validUser';

const authRouter = Router();
const { signup } = authController;
const { usernameExists, emailExists } = userValidation;

authRouter.post('/signup', validateBody('signup'), usernameExists, emailExists, signup);

export default authRouter;
