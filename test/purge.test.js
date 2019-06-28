import chai, { expect } from 'chai';
import purgeDeadTokens from '../src/helpers/purgeDeadTokens';

// eslint-disable-next-line no-unused-vars
const should = chai.should();

describe('Delete expired tokens from database', () => {
  it('it should purge Blacklits table of expired tokens', async () => {
    const purge = await purgeDeadTokens();
    expect(purge).to.equal(0);
  });
});
