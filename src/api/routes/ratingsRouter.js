import { Router } from 'express';
import ratingsController from '../controllers/ratingController';
import auth from '../../middleware/auth';

const { verifyToken } = auth;
const ratingsRouter = Router();
const {
  calculateArticleRatings
} = ratingsController;

ratingsRouter.post('/articles/:slug', verifyToken, calculateArticleRatings);

export default ratingsRouter;
