import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import isAuth from '../../middleware/auth';

const articlesRouter = Router();
const { createArticle, getAllArticle, getOneArticle } = articlesController;

articlesRouter.post('/', isAuth.verifyToken, createArticle);

articlesRouter.get('/', getAllArticle);

articlesRouter.get('/:slug', getOneArticle);

export default articlesRouter;
