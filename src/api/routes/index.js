import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import profilesRouter from './profilesRouter';

const api = express();

// Routers go here
api.use('/auth', authRouter);
api.use('/user', userRouter);
api.use('/profiles', profilesRouter);

export default api;
