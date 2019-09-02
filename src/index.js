/* eslint-disable import/no-named-as-default */
import 'regenerator-runtime';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import http from 'http';
import io from 'socket.io';
import api from './api/routes/index';
import globalMiddleware from './middleware/globalMiddleware';
import './config/passportSetup';
import db from './sequelize/models/index';
import swaggerDoc from '../swagger.json';
import SocketIO from './helpers/SocketIO';
import ChatHandler from './helpers/chat/ChatHandler';
import './helpers/notifications/EventListener';

import './handlers/cloudinary';
import workers from './workers';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const { sequelize } = db;
const { purgeWorker, sendMailWorker } = workers;

const server = http.createServer(app);
app.server = server;
ChatHandler(app, io(server));


app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true
}));
SocketIO(app);
app.use(passport.initialize());
app.use(passport.session());
globalMiddleware(app);
app.get('/', (req, res) => {
  res.redirect('/docs');
});
app.use('/api', api);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: {
      message: 'Page Not found'
    }
  });
});

sequelize.sync().then(() => {
  cron.schedule('*/1 * * * *', () => {
    purgeWorker();
  });
  cron.schedule('*/1 * * * *', () => {
    sendMailWorker();
  });
  app.server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Database succesfully connected\nPID: ${process.pid} Server listening on port: ${port} in ${process.env.NODE_ENV} mode`);
  });
});

export default app;
