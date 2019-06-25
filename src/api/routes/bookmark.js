import { Router } from 'express';
import Auth from '../../middleware/auth';
import BookmarkController from '../controllers/bookmark';

const router = Router();
const { getOwnerBookmarks } = BookmarkController;
const { verifyToken } = Auth;

router.get('/', verifyToken, getOwnerBookmarks);
export default router;
