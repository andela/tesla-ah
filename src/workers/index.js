import purgeDeadTokens from './purgeDeadTokens';
import queueEmail from './queueEmail';
import sendMail from './sendMail';
import uploadImage from './uploadImage';

/*
const workerFarm = require('worker-farm');
workers.purgeWorker = workerFarm(require.resolve('./purgeDeadTokens'));
workers.queueEmailWorker = workerFarm(require.resolve('./queueEmail'));
workers.sendMailWorker = workerFarm(require.resolve('./sendMail'));
workers.uploadImageWorker = workerFarm(require.resolve('./uploadImage'));
*/

const workers = {};
workers.purgeWorker = purgeDeadTokens;
workers.queueEmailWorker = queueEmail;
workers.sendMailWorker = sendMail;
workers.uploadImageWorker = uploadImage;

export default workers;
