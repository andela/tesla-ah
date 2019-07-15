import { Router } from 'express';
import passport from 'passport';
// eslint-disable-next-line import/no-named-as-default
import authController from '../controllers/auth';
import validateBody from '../../middleware/validateBody';
import userValidation from '../../middleware/validUser';
import validateGender from '../../middleware/validateGender';
import Auth from '../../middleware/auth';
import socialLogin from '../controllers/socialLogin';
import socialAccount from '../../middleware/socialAccountExists';
import socialMiddleware from '../../middleware/socialTest';
import termsAndConditions from '../controllers/termsAndConditions';

const authRouter = Router();

const {
  RequestPasswordReset,
  ConfirmPasswordReset,
  ApplyPasswordReset,
  register,
  verifyAccount,
  SignOut,
  login
} = authController;
const { usernameExists, emailExists } = userValidation;
const { verifyToken } = Auth;

const { google, twitter } = socialAccount;
const { getTermsAndConditions } = termsAndConditions;

// terms and conditions

authRouter.get('/termsandconditions/:id', getTermsAndConditions);

// social login test routes

authRouter.post(
  '/login/google/test',
  socialMiddleware,
  google,
  socialLogin.googleLogin
);
authRouter.post(
  '/login/facebook/test',
  socialMiddleware,
  google,
  socialLogin.facebookLogin
);
authRouter.post(
  '/login/twitter/test',
  socialMiddleware,
  twitter,
  socialLogin.twitterLogin
);

// social login

authRouter.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
authRouter.get(
  '/login/google/redirect',
  passport.authenticate('google', { session: false }),
  google,
  socialLogin.googleLogin
);

authRouter.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
authRouter.get(
  '/login/facebook/redirect',
  passport.authenticate('facebook', { session: false }),
  google,
  socialLogin.facebookLogin
);

authRouter.get(
  '/login/twitter',
  passport.authenticate('twitter', { scope: ['profile', 'email'] })
);
authRouter.get(
  '/login/twitter/redirect',
  passport.authenticate('twitter', { session: false }),
  twitter,
  socialLogin.twitterLogin
);

authRouter.get('/signout', verifyToken, SignOut);
authRouter.post('/login', validateBody('login'), login);
authRouter.post('/signup', validateBody('signup'), validateGender, usernameExists, emailExists, register);
authRouter.get('/verify', verifyAccount);
authRouter.post('/reset', validateBody('passwordReset'), RequestPasswordReset);
authRouter.get('/reset/:token', ConfirmPasswordReset);
authRouter.patch('/reset/:aprvToken', validateBody('applyPassword'), ApplyPasswordReset);

export default authRouter;
