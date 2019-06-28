/* eslint-disable no-console */
import Sequelize from 'sequelize';
import db from '../sequelize/models';

const { Blacklist } = db;
const { Op } = Sequelize;

export default async () => {
  console.log('=== STARTING EXPIRED TOKEN PURGE ===');
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
