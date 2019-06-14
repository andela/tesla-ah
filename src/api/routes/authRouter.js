import { Router } from 'express';
import authController from '../controllers/auth';
import validateBody from '../../middleware/validateBody';
import userValidation from '../../middleware/validUser';
import validateGender from '../../middleware/validateGender';
import Auth from '../../middleware/auth';
import dropToken from '../../middleware/droppedToken';

const authRouter = Router();
const { usernameExists, emailExists } = userValidation;
const { register, verifyAccount, SignOut } = authController;
const { verifyToken } = Auth;

authRouter.get('/signout', verifyToken, dropToken, SignOut);

authRouter.post('/signup', validateBody('signup'), validateGender, usernameExists, emailExists, register);
authRouter.get('/verify', verifyAccount);

export default authRouter;
