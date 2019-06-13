import { Router } from 'express';
import authController from '../controllers/auth';
import validateBody from '../../middleware/userValidations';
import userValidation from '../../middleware/validUser';


const authRouter = Router();
const { signup } = authController;

authRouter.post('/signup', validateBody('signup'), userValidation.usernameExists, userValidation.emailExists, signup);

export default authRouter;
