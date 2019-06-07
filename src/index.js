import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import api from './api/routes';
import globalMiddleware from './middleware/globalMiddleware';
import swaggerDoc from '../swagger.json';

import { sequelize } from './db';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use('/', swaggerUi.serve,swaggerUi.setup(swaggerDoc));


globalMiddleware(app);

app.use('/api', api);

sequelize.sync().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Database succesfully connected\nServer listening on port: ${port} in ${process.env.NODE_ENV} mode`);
  });
});
