/* eslint-disable no-console */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../src/index';

dotenv.config();

chai.use(chaiHttp);
describe('POST and GET /api/categories', () => {
  let adminToken;
  it('', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: 'u1.audace@gmail.com',
        password: process.env.SUPER_ADMIN_PSW
      })
      .end((err, res) => {
        // expect(res.body).to.be.an('object');
        adminToken = res.body.data.token;
        done();
      });
  });

  it('Admin should create a new category', () => {
    chai
      .request(app)
      .post('/api/categories')
      .set('token', `${adminToken}`)
      .send({
        categoryName: 'technology'
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        // expect(res.body.data).to.be.an('object');
        // expect(res.body.message).to.be.a('string');
      });
  });

  it('Admin should create many categories as he/she wants', () => {
    chai
      .request(app)
      .post('/api/categories')
      .set('token', `${adminToken}`)
      .send({
        categoryName: 'other'
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('object');
        expect(res.body.message).to.be.a('string');
      });
  });

  it('Admin should update an existing category', () => {
    chai
      .request(app)
      .put('/api/categories/1')
      .set('token', `${adminToken}`)
      .send({
        categoryName: 'politics'
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
      });
  });

  it('It should fetch all articles related to a specific category', () => {
    chai
      .request(app)
      .get('/api/categories/other/articles')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
  });
  it('Admin should delete an existing category', () => {
    chai
      .request(app)
      .delete('/api/categories/1')
      .set('token', `${adminToken}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      });
  });
});
