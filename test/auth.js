import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';


dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);


describe('User Registration', () => {
  it('should not let a user signup without valid credentials ', (done) => {
    chai.request(server)
      .post('/api/auth/signup')
      .send({
        firstName: 'Emy',
        lastName: 'Rukundo',
        username: 'emy2',
        email: 'rukundogmail.com',
        password: 'Rukundo1!',
        confirmPassword: 'Rukundo1!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not let a user signup with an already existing email ', (done) => {
    chai.request(server)
      .post('/api/auth/signup')
      .send({
        firstName: 'Emy',
        lastName: 'Rukundo',
        username: 'mifeillee',
        email: 'nimilleer@gmail.com',
        password: 'Rukundo1!',
        confirmPassword: 'Rukundo1!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not let a user signup with an already existing username ', (done) => {
    chai.request(server)
      .post('/api/auth/signup')
      .send({
        firstName: 'Emy',
        lastName: 'Rukundo',
        username: 'mifeille',
        email: 'nimiller@gmail.com',
        password: 'Rukundo1!',
        confirmPassword: 'Rukundo1!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
