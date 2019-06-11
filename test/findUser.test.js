/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import findUser from '../src/helpers/FindUser';
import users from './mock/users';
import db from '../src/sequelize/models';

const { User } = db;
let currentUser;
describe('Test for finding user by username', () => {
  before(async () => {
    currentUser = await User.create(users.user2);
  });
  it('Should return a user object', async () => {
    const user = await findUser(currentUser.username);
    expect(user).to.be.an('object');
  });
});
