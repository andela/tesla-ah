import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

export default dbUrl => new Promise((resolve, reject) => {
  if (!dbUrl) {
    reject(new Error('DB URL is missing'));
  }

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

  const parsedData = {
    dbUser,
    dbPassword,
    dbName,
    dbPort,
    dbHost
  };
  resolve(parsedData);
});
