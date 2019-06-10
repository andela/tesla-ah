import { Router } from 'express';
import authController from '../controllers/auth';
import validateBody from '../../middleware/validateBody';
import userValidation from '../../middleware/validUser';
import validateGender from '../../middleware/validateGender';

const authRouter = Router();
const { usernameExists, emailExists } = userValidation;
const { register, verifyAccount } = authController;

authRouter.post('/signup', validateBody('signup'), validateGender, usernameExists, emailExists, register);
authRouter.get('/verify', verifyAccount);

export default authRouter;
