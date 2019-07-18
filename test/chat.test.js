import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import chatHelper from '../src/helpers/chat/saveChats';

const { saveMessage, updateReadMessages, getUnreadMessageCount } = chatHelper;

const { expect } = chai;
chai.use(chaiHttp);

dotenv.config();
let userToken;
let userToken2;
describe('User Registration', () => {
  describe('Logoin', () => {
    it('Should return 200 when user logged in successful', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'ericprestein',
          password: 'Eric.00005'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          const { token } = res.body.data;
          userToken = token;
          done();
        });
    });
    it('Should return 200 when user logged in successful', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'ericpresteinjjj',
          password: 'Eric.00005'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          const { token } = res.body.data;
          userToken2 = token;
          done();
        });
    });
  });
  describe('Get all users', () => {
    it('Should return 200 when users loaded successful', (done) => {
      chai
        .request(server)
        .get('/api/chats/users')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('Should return 200 when you have no follower', (done) => {
      chai
        .request(server)
        .get('/api/chats/users')
        .set('token', userToken2)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
  describe('Get chat ', () => {
    it('Should return message', (done) => {
      chai
        .request(server)
        .get('/api/chats/ericprestein')
        .set('token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
  describe('Send message chat ', () => {
    it('Should create message', (done) => {
      saveMessage({
        sender: 'superUser',
        receiver: 'ericpresteinjjj',
        message: 'Hello'
      }).then((result) => {
        expect(result).to.be.an('object');
      });
      done();
    });
    it('Should update message', (done) => {
      updateReadMessages('superUser').then((result) => {
        expect(result).to.be.a('number');
      });
      done();
    });
    it('Should update message', (done) => {
      getUnreadMessageCount('superUser').then((result) => {
        expect(result).to.be.a('number');
      });
      done();
    });
  });
});
