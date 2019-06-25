import dotenv from 'dotenv';

const config = {};
dotenv.config();
config.development = {
  use_env_variable: 'DATABASE_URL',
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false
};

config.staging = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres'
};

config.test = {
  use_env_variable: 'DATABASE_TEST_URL',
  dialect: 'postgres',
  logging: false
};

config.production = {
  dbUrl: process.env.PROD_DATABASE_URL,
  dialect: 'postgres'
};

module.exports = config;
