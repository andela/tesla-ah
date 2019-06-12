import dotenv from 'dotenv';

const config = {};
dotenv.config();
config.development = {
  username: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
  host: '127.0.0.1',
  dialect: 'postgres'
};

config.staging = {
  use_env_variable: 'DATABASE_URL',
};

config.test = {
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  host: '127.0.0.1',
  dialect: 'postgres'
};

config.production = {
  dbUrl: process.env.PROD_DATABASE_URL,
};

module.exports = config;
