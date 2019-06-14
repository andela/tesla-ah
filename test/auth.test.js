import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import db from '../src/sequelize/models';

const { User } = db;


const { expect } = chai;
chai.use(chaiHttp);

dotenv.config();
let userToken;
describe('User Registration', () => {
  before(async () => {
    await User.destroy({
      where: {
        email: 'elie@gmail.com'
      }
    });
  });
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

  it('should not let a user signup with gender chich is not M or F', (done) => {
    chai.request(server).post('/api/auth/signup')
      .send({
        firstName: 'Elie',
        lastName: 'Mugenzi',
        username: 'elie',
        email: 'elie@gmail.com',
        password: 'Rukundo1!',
        confirmPassword: 'Rukundo1!',
        gender: 'G'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should not verify an account because of invalid token', (done) => {
    chai.request(server).get('/api/auth/verify/?token=ffhsfjsf')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should let user signup', (done) => {
    chai.request(server).post('/api/auth/signup')
      .send({
        firstName: 'Elie',
        lastName: 'Mugenzi',
        username: 'elie',
        email: 'elie@gmail.com',
        password: 'Rukundo1!',
        confirmPassword: 'Rukundo1!',
        gender: 'M'
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        expect(res.body.token).to.be.a('string');
        userToken = res.body.token;
        done();
      });
  });
  it('should verify account', (done) => {
    chai.request(server).get(`/api/auth/verify/?token=${userToken}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(202);
        done();
      });
  });
});
