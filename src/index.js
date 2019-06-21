import 'regenerator-runtime';
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import api from './api/routes/index';
import globalMiddleware from './middleware/globalMiddleware';
import './config/passportSetup';
import swaggerDoc from '../swagger.json';
import db from './sequelize/models/index';

import './handlers/cloudinary';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const { sequelize } = db;

globalMiddleware(app);
app.use('/api', api);
app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
globalMiddleware(app);
app.use('/api', api);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('*', (req, res) => {
  res.status(404).send({
    error: 'Page Not found'
  });
});


sequelize.sync().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Database succesfully connected\nServer listening on port: ${port} in ${process.env.NODE_ENV} mode`);
  });
});

export default app;
