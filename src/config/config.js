import dbUrlParser from '../helpers/dbUrlParser';

const config = {};

config.development = {
  username: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
  host: '127.0.0.1',
  dialect: 'postgres'
};

// Parse heroku db url for staging mode
dbUrlParser(process.env.DATABASE_URL).then((data) => {
  const { dbUser, dbPassword, dbName } = data;

  config.staging = {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: '127.0.0.1',
    dialect: 'postgres'
  };
});

config.test = {
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  host: '127.0.0.1',
  dialect: 'postgres'
};

config.production = {
  username: 'root',
  password: null,
  database: 'database_production',
  host: '127.0.0.1',
  dialect: 'postgres'
};

module.exports = config;
