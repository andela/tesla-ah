import { Router } from 'express';
import articlesController from '../controllers/articlesController';
import Auth from '../../middleware/auth';
import check from '../../middleware/checkOwner';
import validateBody from '../../middleware/validateBody';
import search from '../../middleware/search';
import commentsController from '../controllers/comments';
import comment from '../../middleware/validComment';
import RatingController from '../controllers/ratingController';
import slugExist from '../../middleware/slugExist';
import isAlreadBlocked from '../../middleware/blockedarticleExist';
import isNotBlocked from '../../middleware/articleNotBlocked';
import isThisArticleBlocked from '../../middleware/isThisArticleBlocked';
import bookmarkController from '../controllers/bookmark';
import checkLikesandDislikes from '../../middleware/checkLikesDislikes';
import paginate from '../../middleware/paginate';
<<<<<<< HEAD
import shareArticle from '../../middleware/shareArticle';
import stats from '../controllers/stats';
import highlight from '../controllers/highlightController';
import highlightExist from '../../middleware/highlightExist';
import textExist from '../../middleware/textExist';
import upload from '../../handlers/multer';
=======
import shareArticle from '../../helpers/shareArticle';
import isVerified from '../../middleware/isVerified';
import checkArticleLikes from '../../middleware/checkArticleLikes';
>>>>>>> feat(refactoring): Improve Code maintainablilty

const articlesRouter = Router();
const {
  getViews, commentNumber, facebookShares, twitterShares, emailShares, shares
} = stats;
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
  reportArticle,
  blockArticle,
  unBlockArticle,
  share,
  getBlockedArticles,
  getReportedArticles
} = articlesController;
const { checkLikes, checkDislikes } = checkArticleLikes;
const { verifyToken, checkIsModerator } = Auth;
const { createRatings, UpdateRatings } = RatingController;
const { bookmark } = bookmarkController;
const { createHighlights } = highlight;
const { searchForArticle } = search;
const {
  createComment, editComment, deleteComment, getComment, commentAcomment,
  likeComment, dislikeComment, countLikes, countDislikes, commentHistory
} = commentsController;
const { checkComment, checkParameter, articleExists } = comment;
const { liked, disliked } = checkLikesandDislikes;

articlesRouter
<<<<<<< HEAD
  .post('/', verifyToken, upload.fields([{ name: 'gallery', maxCount: 10 }]), validateBody('createArticle'), createArticle)
=======
  .post('/', verifyToken, validateBody('createArticle'), isVerified, createArticle)
>>>>>>> feat(refactoring): Improve Code maintainablilty
  .get('/', paginate, searchForArticle, getAllArticle);

articlesRouter
  .get('/:slug', slugExist, isThisArticleBlocked, getOneArticle)
  .put('/:slug', verifyToken, check.articleOwner, upload.fields([{ name: 'gallery', maxCount: 10 }]), validateBody('updateArticle'), updateArticle)
  .delete('/:slug', verifyToken, check.articleOwner, deleteArticle);

articlesRouter
  .get('/:slug/like', slugExist, getLikes)
  .post('/:slug/like', verifyToken, slugExist, checkLikes, likeArticle);

articlesRouter
  .get('/:slug/dislike', slugExist, getDislikes)
  .post('/:slug/dislike', verifyToken, slugExist, checkDislikes, dislikeArticle);

// Comments routes
articlesRouter.post('/:slug/comments', verifyToken, validateBody('checkComment'), articleExists, checkComment, createComment);
articlesRouter.post('/:slug/comments/:commentId', verifyToken, validateBody('checkComment'), articleExists, checkComment, commentAcomment);
articlesRouter.patch('/comments/:commentId', verifyToken, validateBody('checkComment'), checkParameter, editComment);
articlesRouter.delete('/comments/:commentId', verifyToken, checkParameter, deleteComment);
articlesRouter.get('/:slug/comments', slugExist, getComment);
articlesRouter.post('/:slug/rating', verifyToken, validateBody('validateRating'), slugExist, createRatings);
articlesRouter.put('/:slug/rating', verifyToken, validateBody('validateRating'), slugExist, UpdateRatings);

// Bookmarks routes

articlesRouter.post('/:slug/bookmark', verifyToken, slugExist, bookmark);
// like and dislike comments
articlesRouter.post('/comments/:commentId/like', verifyToken, checkParameter, liked, likeComment);
articlesRouter.post('/comments/:commentId/dislike', verifyToken, checkParameter, disliked, dislikeComment);

// get likes and dislikes of comments

articlesRouter.get('/comments/:commentId/dislikes', checkParameter, countDislikes);
articlesRouter.get('/comments/:commentId/likes', checkParameter, countLikes);
// sharing articles
articlesRouter.get('/:slug/share/twitter', verifyToken, slugExist, shareArticle, share);
articlesRouter.get('/:slug/share/facebook', verifyToken, slugExist, shareArticle, share);
articlesRouter.get('/:slug/share/linkedin', verifyToken, slugExist, shareArticle, share);
articlesRouter.get('/:slug/share/pinterest', verifyToken, slugExist, shareArticle, share);
articlesRouter.get('/:slug/share/email', verifyToken, slugExist, shareArticle, share);

articlesRouter.post('/:slug/bookmark', verifyToken, slugExist, bookmark);

articlesRouter.post('/:slug/report', verifyToken, validateBody('checkComment'), slugExist, reportArticle);
// get comment edit history

articlesRouter.get('/comments/:commentId/history', verifyToken, checkParameter, commentHistory);

// articles reading stats

articlesRouter.get('/:slug/comments/count', slugExist, commentNumber);
articlesRouter.get('/:slug/views', slugExist, getViews);
articlesRouter.get('/:slug/shares/facebook', slugExist, facebookShares);
articlesRouter.get('/:slug/shares/twitter', slugExist, twitterShares);
articlesRouter.get('/:slug/shares/email', slugExist, emailShares);
articlesRouter.get('/:slug/shares', slugExist, shares);

// block reported articles
articlesRouter
  .post('/:slug/block', verifyToken, checkIsModerator, validateBody('checkDescription'), slugExist, isAlreadBlocked, blockArticle)
  .post('/:slug/unblock', verifyToken, checkIsModerator, slugExist, isNotBlocked, unBlockArticle)
  .get('/blocked/all', verifyToken, checkIsModerator, getBlockedArticles)
  .get('/reported/all', verifyToken, checkIsModerator, getReportedArticles);
// highlight the text in the article

articlesRouter.post('/:slug/highlight', verifyToken, validateBody('validateHighlight'), slugExist, highlightExist, textExist, createHighlights);

export default articlesRouter;
