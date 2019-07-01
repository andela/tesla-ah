const workerFarm = require('worker-farm');

const workers = {};

workers.purgeWorker = workerFarm(require.resolve('./purgeDeadTokens'));
workers.queueEmailWorker = workerFarm(require.resolve('./queueEmail'));
workers.sendMailWorker = workerFarm(require.resolve('./sendMail'));
workers.uploadImageWorker = workerFarm(require.resolve('./uploadImage'));

export default workers;
