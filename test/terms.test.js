import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import models from '../src/sequelize/models';
import tokenHelper from '../src/helpers/Token.helper';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

let adminToken, termsId, userObject, testUser, userToken;

describe('Terms and Conditions', () => {
  before(async () => {
    const termsConditions = await models.termsAndCondition.create({ termsAndConditions: 'Authors Haven Terms and conditions' });
    termsId = termsConditions.dataValues.id;
    userObject = {
      firstName: 'user',
      lastName: 'user',
      username: 'user',
      email: 'user@luffy.co',
      password: 'User123!',
      confirmPassword: 'User123!',
      roles: ['user'],
    };

    testUser = await models.User.create(userObject);

    // generate test token
    userToken = await tokenHelper.generateToken({ id: testUser.dataValues.id });
  });
  it('should be able to get terms and conditions', (done) => {
    chai
      .request(server)
      .get(`/api/auth/termsandconditions/${termsId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should notify the user when terms and conditions are not found', (done) => {
    chai
      .request(server)
      .get('/api/auth/termsandconditions/55555')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let an admin log in', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        email: 'superadmin@gmail.com',
        password: process.env.SUPER_ADMIN_PSW
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        adminToken = res.body.data.token;
        done();
      });
  });
  it('should be able to update terms and conditions', (done) => {
    chai
      .request(server)
      .patch(`/api/termsandconditions/${termsId}`)
      .set('token', adminToken)
      .send({
        termsAndConditions: `Authors Haven Terms and conditions
Welcome to Authors Haven`
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('terms and conditions are required', (done) => {
    chai
      .request(server)
      .patch(`/api/termsandconditions/${termsId}`)
      .set('token', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should not let a normal user update the terms and conditions', (done) => {
    chai
      .request(server)
      .patch(`/api/termsandconditions/${termsId}`)
      .set('token', userToken)
      .send({
        termsAndConditions: `Authors Haven Terms and conditions
Welcome to Authors Haven`
      })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
