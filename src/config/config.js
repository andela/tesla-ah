const config = {};

config.development = {
  dbUrl: process.env.DEV_DATABASE_URL,
  dialect: 'postgres',
};

config.staging = {
  dbUrl: process.env.DATABASE_URL,
};

config.test = {
  dbUrl: process.env.TEST_DATABASE_URL,
};

config.production = {
  dbUrl: process.env.PROD_DATABASE_URL,
};

module.exports = config;
