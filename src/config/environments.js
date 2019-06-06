import dotenv from 'dotenv';

dotenv.config();

const environments = {
  development: {
    dbUrl: process.env.DATABASE_URL,
  },
  staging: {
    dbUrl: process.env.DATABASE_URL,
  },
  test: {
    dbUrl: process.env.DATABASE_URL,
  },
};

// Determine which environment we are in
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one the envs defined above, if not default to development
const environment = typeof (environments[currentEnvironment]) === 'object'
  ? environments[currentEnvironment] : environments.development;

// Export the selected environment configuration object
export default environment;
