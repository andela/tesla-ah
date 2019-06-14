import chai from 'chai';
import hashHelper from '../src/helpers/hashHelper';


const { expect } = chai;

describe('Password hash based tests', () => {
  let hashed;
  const password = 'whatever123';
  it('should hash password', () => {
    hashed = hashHelper.hashPassword(password);
    expect(hashed).to.be.a('string');
  });
  it('should compare password', () => {
    const isDone = hashHelper.comparePassword(password, hashed);
    expect(isDone).to.equal(true);
  });
  it('should compare the password but returns false', () => {
    const isDone = hashHelper.comparePassword('afdfjdhasd', hashed);
    expect(isDone).to.equal(false);
  });
});
