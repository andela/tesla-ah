import dotenv from 'dotenv';

const config = {};
dotenv.config();
config.development = {
  use_env_variable: 'DEV_DATABASE_URL',
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false,
  seederStorage: 'sequelize'
};

config.staging = {
  use_env_variable: 'DATABASE_URL',
  seederStorage: 'sequelize'
};

config.test = {
  use_env_variable: 'DATABASE_TEST_URL',
  logging: false,
  seederStorage: 'sequelize'
};

config.production = {
  dbUrl: process.env.PROD_DATABASE_URL,
  seederStorage: 'sequelize'
};

module.exports = config;
