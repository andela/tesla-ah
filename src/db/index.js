import Sequelize from 'sequelize';
import dbUrlParser from '../helpers/dbUrlParser';
import environment from '../config/environments';

const {
  dbUser,
  dbPassword,
  dbName,
  dbHost
} = dbUrlParser(environment.dbUrl);

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    dialect: 'postgres',
    host: dbHost,
    logging: false,
  },
);

const models = {
  // User: sequelize.import('../models/user'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
