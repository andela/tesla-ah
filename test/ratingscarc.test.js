import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';

const { expect } = chai;
chai.use(chaiHttp);
let token;

dotenv.config();
describe('Articles ratings', () => {
  describe('Ratings Report', () => {
    it('Should return 200 when user logged in successful', (done) => {
      chai.request(server)
        .post('/api/auth/login')
        .send({
          email: 'ericprestein005@gmail.com',
          password: 'Eric.00005'
        })
        .end((err, res) => {
          ({ token } = res.body.data);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return 200 when article ratings found and calcurated successfuly', (done) => {
      chai.request(server)
        .post('/api/ratings/articles/This_is_andela_2433546h34')
        .set('token', `${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return 404 when article ratings not found', (done) => {
      chai.request(server)
        .post('/api/ratings/articles/gf2433546h34')
        .set('token', `${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
