import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import isAuth from '../../middleware/auth';
import check from '../../middleware/checkOwner';
import validate from '../../middleware/validations';

const articlesRouter = Router();
const {
  createArticle, getAllArticle, getOneArticle, updateArticle, deleteArticle
} = articlesController;

articlesRouter.post('/', isAuth.verifyToken, validate.createValidations, createArticle);

articlesRouter.get('/', getAllArticle);

articlesRouter.get('/:slug', getOneArticle);

articlesRouter.put('/:slug', isAuth.verifyToken, check.articleOwner, validate.updateValidations, updateArticle);

articlesRouter.delete('/:slug', isAuth.verifyToken, check.articleOwner, deleteArticle);

export default articlesRouter;
