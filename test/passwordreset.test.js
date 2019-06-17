import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src';

chai.use(chaiHttp);
const { expect } = chai;
let token;
describe('Password reset', () => {
  describe('Request password reset  POST /api/auth/reset ', () => {
    it('it should return 400 when email is not varidated', (done) => {
      chai
        .request(app)
        .post('/api/auth/reset')
        .send({ email: 'gprestein055' })
        .end((err, res) => {
          expect(res.body.status).to.eql(400);
          done();
        });
    });
    it('it should return 404 when email is not exist', (done) => {
      chai
        .request(app)
        .post('/api/auth/reset')
        .send({ email: 'ericprestein055@gmail.com' })
        .end((err, res) => {
          expect(res.body.status).to.eql(404);
          done();
        });
    });
    it('it should return 201 when password reset lint, sent successful', (done) => {
      chai
        .request(app)
        .post('/api/auth/reset')
        .send({ email: 'nimilleer@gmail.com' })
        .end(async (err, res) => {
          expect(res.body.status).to.eql(201);
          ({ token } = res.body.data);
          done();
        });
    });
  });
  describe('Confirm password reset GET /api/auth/reset:token', () => {
    it('it should return 500 or 304 when invalid token or expired token passed', (done) => {
      chai
        .request(app)
        .get(`/api/auth/reset/${token}ghjfufuf`)
        .end(async (err, res) => {
          expect(res.body.status).to.eql(500 || 304);
          done();
        });
    });
    it('it should return 200 when password reset confirmed', (done) => {
      chai
        .request(app)
        .get(`/api/auth/reset/${token}`)
        .end(async (err, res) => {
          expect(res.body.status).to.eql(200);
          ({ token } = res.body.data);
          done();
        });
    });
  });
  describe('Apply password reset PATCH /api/auth/reset:aprvToken', () => {
    it('it should return 500 or 400 when email is invalid', (done) => {
      chai
        .request(app)
        .patch(`/api/auth/reset/${token}`)
        .send({ newpassword: 'Eric' })
        .end(async (err, res) => {
          expect(res.body.status).to.eql(400);
          done();
        });
    });
    it('it should return 201 when reset is successful', (done) => {
      chai
        .request(app)
        .patch(`/api/auth/reset/${token}`)
        .send({ newpassword: 'Eric0000005555' })
        .end(async (err, res) => {
          expect(res.body.status).to.eql(201);
          done();
        });
    });
  });
});
