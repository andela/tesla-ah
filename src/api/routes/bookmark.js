import { Router } from 'express';
import Auth from '../../middleware/auth';
import BookmarkController from '../controllers/bookmark';

const router = Router();
const { getOwnerBookmarks, deleteBookmarks } = BookmarkController;
const { verifyToken } = Auth;

router.get('/', verifyToken, getOwnerBookmarks);
router.delete('/:slug', verifyToken, deleteBookmarks);
export default router;
