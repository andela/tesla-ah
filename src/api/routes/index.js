import express from 'express';
import authRouter from './authRouter';
import articlesRouter from './articlesRouter';

const api = express();

// Routers go here
api.use('/auth', authRouter);

api.use('/articles', articlesRouter);

export default api;
