import { Router } from 'express';
import chat from '../controllers/chatController';
import auth from '../../middleware/auth';

const { getUsers, getMessages, sendMessage } = chat;
const { verifyToken } = auth;
const chatRouter = Router();

chatRouter.get('/users', verifyToken, getUsers);
chatRouter.get('/:username', verifyToken, getMessages);
chatRouter.post('/messages/:username', verifyToken, sendMessage);

export default chatRouter;
