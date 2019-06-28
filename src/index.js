import 'regenerator-runtime';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import api from './api/routes/index';
import globalMiddleware from './middleware/globalMiddleware';
import './config/passportSetup';
import db from './sequelize/models/index';
import swaggerDoc from '../swagger.json';
import './handlers/cloudinary';
import purgeDeadTokens from './helpers/purgeDeadTokens';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const { sequelize } = db;

globalMiddleware(app);
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
globalMiddleware(app);
app.get('/', (req, res) => { res.redirect('/docs'); });
app.use('/api', api);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: {
      message: 'Page Not found',
    }
  });
});

sequelize.sync().then(() => {
  cron.schedule('*/59 * * * *', () => {
    purgeDeadTokens();
  });
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Database succesfully connected\nServer listening on port: ${port} in ${process.env.NODE_ENV} mode`);
  });
});

export default app;
