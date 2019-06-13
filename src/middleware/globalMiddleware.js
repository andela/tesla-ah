import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

export default (app) => {
  app
    // Parse req object and make data available on req.body
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    // Allow cross origin requests
    .use(cors());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
};
