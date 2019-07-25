import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import profilesRouter from './profilesRouter';
import articlesRouter from './articlesRouter';
import ratingsRouter from './ratingsRouter';
import termsAndConditionsRouter from './termsConditionsRouter';
import chatRouter from './chatRouter';
import bookmarkRouter from './bookmarkRouter';

const api = express();

// Routers go here
api.use('/auth', authRouter);
api.use('/user', userRouter);
api.use('/profiles', profilesRouter);
api.use('/articles', articlesRouter);
api.use('/ratings', ratingsRouter);
api.use('/bookmarks', bookmarkRouter);
api.use('/termsandconditions', termsAndConditionsRouter);
api.use('/chats', chatRouter);

export default api;
