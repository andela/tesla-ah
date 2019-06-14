import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

export default (dbUrl) => {
  const urlObj = url.parse(dbUrl);
  const {
    auth,
    port: dbPort,
    hostname: dbHost,
    pathname
  } = urlObj;

  const dbUser = auth.split(':')[0];
  const dbPassword = auth.split(':')[1] || '';
  const dbName = pathname.split('/')[1];

  return {
    dbUser,
    dbPassword,
    dbName,
    dbPort,
    dbHost
  };
};
