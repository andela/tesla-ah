import { Router } from 'express';
import authController from '../controllers/auth';
import signupValidation from '../../middleware/validateBody';
import emailValidation from '../../middleware/userExists';
import usernameValidation from '../../middleware/usernameExists';

const authRouter = Router();
const { signup } = authController;

authRouter.post('/signup', signupValidation, usernameValidation.usernameExist, emailValidation.userExist, signup);

export default authRouter;
