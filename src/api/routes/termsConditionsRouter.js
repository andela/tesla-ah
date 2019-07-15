import { Router } from 'express';
import termsAndConditions from '../controllers/termsAndConditions';
import validateBody from '../../middleware/validateBody';
import Auth from '../../middleware/auth';

const termsRouter = Router();

const { updateTermsAndConditions } = termsAndConditions;
const { verifyToken, checkIsAdmin } = Auth;

// terms and conditions

termsRouter.patch('/:id', verifyToken, checkIsAdmin, validateBody('validateTerms'), updateTermsAndConditions);

export default termsRouter;
