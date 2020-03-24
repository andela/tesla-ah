import { Router } from 'express';
import ratingsController from '../controllers/ratingController';

const ratingsRouter = Router();
const {
  calculateArticleRatings
} = ratingsController;

ratingsRouter.get('/articles/:slug', calculateArticleRatings);

export default ratingsRouter;
