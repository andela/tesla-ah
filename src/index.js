import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import api from './api/routes';
import globalMiddleware from './middleware/globalMiddleware';
import  swaggerDoc from '../swagger.json';


dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use('/', swaggerUi.serve,swaggerUi.setup(swaggerDoc));


globalMiddleware(app);

app.use('/api', api);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port: ${port} in ${process.env.NODE_ENV} mode`);
});
