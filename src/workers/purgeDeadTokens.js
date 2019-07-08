/* eslint-disable no-console */
import 'regenerator-runtime';
import Sequelize from 'sequelize';
import db from '../sequelize/models';

const { Blacklist } = db;
const { Op } = Sequelize;

module.exports = async () => {
  console.log(`PID: ${process.pid} === STARTING EXPIRED TOKEN PURGE ===`);
  await Blacklist.destroy({
    where: {
      expiresAt: {
        [Op.lte]: Date.now()
      }
    }
  });
  console.log('=== DONE PURGING ===');
  return 0;
};
