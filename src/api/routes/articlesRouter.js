import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import Auth from '../../middleware/auth';
import check from '../../middleware/checkOwner';
import validateBody from '../../middleware/validateBody';
import commentsController from '../controllers/comments';
import comment from '../../middleware/validComment';
import RatingController from '../controllers/ratingController';
import slugExist from '../../middleware/slugExist';
import bookmarkController from '../controllers/bookmark';


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
const { createRatings, UpdateRatings } = RatingController;
const { bookmark } = bookmarkController;


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
articlesRouter.post('/:slug/rating', verifyToken, validateBody('validateRating'), slugExist, createRatings);
articlesRouter.put('/:slug/rating', verifyToken, validateBody('validateRating'), slugExist, UpdateRatings);

// Bookmarks routes

articlesRouter.post('/:slug/bookmark', verifyToken, slugExist, bookmark);

export default articlesRouter;
