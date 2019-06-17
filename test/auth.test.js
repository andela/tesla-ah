import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import db from '../src/sequelize/models';
import tokenHelper from '../src/helpers/Token.helper';

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

describe('User SignOut', () => {
  let token;
  before(async () => {
    const user = {
      firstName: 'Emy',
      lastName: 'Rukundo',
      username: 'mifeillee',
      email: 'nimilleer@gmail.com',
      password: 'Rukundo1!',
      confirmPassword: 'Rukundo1!'
    };

    const newUser = await User.create(user);

    token = await tokenHelper.generateToken({ id: newUser.id });
  });

  it('should logout with a valid token', (done) => {
    chai.request(server)
      .get('/api/auth/signout')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should return an error when there is no token', (done) => {
    chai.request(server)
      .get('/api/auth/signout')
      .set('token', ' ')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
describe('Social Login', () => {
  it('should let a user log in with google, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/google/test')
      .send({
        id: '1234',
        email: 'nimilii@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let save a user if he is already in the database, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/google/test')
      .send({
        id: '1234',
        email: 'nimilii@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let a user log in with facebook, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/facebook/test')
      .send({
        id: '12345',
        email: 'nimillr@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let save a user if he is already in the database, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/facebook/test')
      .send({
        id: '12345',
        email: 'nimillr@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let a user log in with twitter, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/twitter/test')
      .send({
        id: '56789',
        email: 'nimil@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let save a user if he is already in the database, test! ', (done) => {
    chai.request(server)
      .post('/api/auth/login/twitter/test')
      .send({
        id: '56789',
        email: 'nimil@yahoo.fr',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
