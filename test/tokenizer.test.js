/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Tokenizer from '../src/api/helpers/Token.helper';

chai.use(chaiHttp);

chai.should();
const { expect } = chai;
let accessToken;

describe('Token generation and decode tests...', () => {
  it('token must be generated', (done) => {
    const user = {
      id: 1,
      name: 'Elie',
      email: 'eliemugenzi@gmail.com',
      password: '123456'
    };

    Tokenizer.generateToken(user).then((token) => {
      accessToken = token;
      expect(token).to.be.a('string');
    });
    done();
  });

  it('should decode the token to get some user info', (done) => {
    Tokenizer.decodeToken(accessToken).then((user) => {
      expect(user).to.be.an('object');
      expect(user.userId).to.be.a('number');
    });
    done();
  });
});
