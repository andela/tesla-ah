import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import Auth from '../../middleware/auth';
import check from '../../middleware/checkOwner';
import validateBody from '../../middleware/validateBody';
import commentsController from '../controllers/comments';
import comment from '../../middleware/validComment';

const articlesRouter = Router();
const {
  createArticle,
  getAllArticle,
  getOneArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
  getLikes,
  getDislikes,
} = articlesController;
const { verifyToken } = Auth;

const {
  createComment, editComment, deleteComment, getComment, commentAcomment
} = commentsController;
const { checkComment, checkParameter, articleExists } = comment;

articlesRouter
  .post('/', verifyToken, validateBody('createArticle'), createArticle)
  .get('/', getAllArticle);

articlesRouter
  .get('/:slug', getOneArticle)
  .put('/:slug', verifyToken, check.articleOwner, validateBody('updateArticle'), updateArticle)
  .delete('/:slug', verifyToken, check.articleOwner, deleteArticle);

articlesRouter
  .get('/:slug/like', getLikes)
  .post('/:slug/like', verifyToken, likeArticle);

articlesRouter
  .get('/:slug/dislike', getDislikes)
  .post('/:slug/dislike', verifyToken, dislikeArticle);

// Comments routes

articlesRouter.post('/:slug/comments', verifyToken, validateBody('checkComment'), articleExists, checkComment, createComment);
articlesRouter.post('/:slug/comments/:commentId', verifyToken, validateBody('checkComment'), articleExists, checkComment, commentAcomment);
articlesRouter.patch('/comments/:commentId', verifyToken, validateBody('checkComment'), checkParameter, editComment);
articlesRouter.delete('/comments/:commentId', verifyToken, checkParameter, deleteComment);
articlesRouter.get('/:slug/comments', getComment);

export default articlesRouter;
