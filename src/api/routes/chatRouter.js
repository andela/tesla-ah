import { Router } from 'express';
import chat from '../controllers/chatController';
import auth from '../../middleware/auth';

const { getUsers, getMessages, getCurrentUser } = chat;
const { verifyToken } = auth;
const chatRouter = Router();

chatRouter.get('/users', verifyToken, getUsers);
chatRouter.get('/currentUser', getCurrentUser);
chatRouter.get('/:username', verifyToken, getMessages);

export default chatRouter;
