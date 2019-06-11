import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src';
import users from './mock/users';
import db from '../src/sequelize/models';
import Tokenizer from '../src/helpers/Token.helper';

const { User } = db;

let token;
chai.use(chaiHttp);
chai.should();

describe('Subscribe and unsubscribe tests', () => {
  before(async () => {
    const newUser = await User.create(users.user2);
    token = await Tokenizer.generateToken({ id: newUser.id });
  });

  it('Should opt-in a user for email notifications', (done) => {
    chai.request(app).post('/api/user/optinemail').set('token', token)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.be.an('object');
      });
    done();
  });
  it('Should not opt-in a user for email notifications again', (done) => {
    chai.request(app).post('/api/user/optinemail').set('token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
    done();
  });

  it('Should opt-in a user for in-app notifications', (done) => {
    chai.request(app).post('/api/user/optinapp').set('token', token)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.be.an('object');
      });
    done();
  });
  it('Should not opt-in a user for in-app notifications again', (done) => {
    chai.request(app).post('/api/user/optinapp').set('token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
    done();
  });

  it('Should opt-out a user for email notifications', (done) => {
    chai.request(app).delete('/api/user/optinemail').set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
      });
    done();
  });
  it('Should not opt-out a user for email notifications if they hadn\'t opted-in', (done) => {
    chai.request(app).delete('/api/user/optinemail').set('token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
    done();
  });

  it('Should opt-out a user for in-app notifications', (done) => {
    chai.request(app).delete('/api/user/optinapp').set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
      });
    done();
  });
  it('Should not opt-out a user for in-app notifications if they had not opted-in', (done) => {
    chai.request(app).delete('/api/user/optinapp').set('token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
    done();
  });
});
