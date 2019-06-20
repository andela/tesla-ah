import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import Auth from '../../middleware/auth';
import check from '../../middleware/checkOwner';
import validateBody from '../../middleware/validateBody';

const articlesRouter = Router();
const {
  createArticle,
  getAllArticle,
  getOneArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
} = articlesController;
const { verifyToken } = Auth;

articlesRouter.post('/', verifyToken, validateBody('createArticle'), createArticle);
articlesRouter.get('/', getAllArticle);
articlesRouter.get('/:slug', getOneArticle);
articlesRouter.put('/:slug', verifyToken, check.articleOwner, validateBody('updateArticle'), updateArticle);
articlesRouter.delete('/:slug', verifyToken, check.articleOwner, deleteArticle);
articlesRouter.post('/:slug/like', verifyToken, likeArticle);
articlesRouter.post('/:slug/dislike', verifyToken, dislikeArticle);

export default articlesRouter;
