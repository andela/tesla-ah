import { expect } from 'chai';
import favourite from '../src/helpers/Favourites';
import users from './mock/users';
import db from '../src/sequelize/models';

const { User } = db;
let currentUser;

describe('Tests for finding who favourited an article', () => {
  before(async () => {
    currentUser = await User.create(users.user1);
  });

  it('Should return an object', async () => {
    const response = await favourite(currentUser.id);
    expect(response).to.be.an('object');
  });
});
