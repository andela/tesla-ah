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
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, token');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
};
