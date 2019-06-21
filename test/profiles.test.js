import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import app from '../src';
import db from '../src/sequelize/models';
import authHelper from '../src/helpers/Token.helper';

const { User } = db;

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

let userToken;
let userObject;
let testUser;
describe('User Profiles', () => {
  before(async () => {
    // create test user
    userObject = {
      firstName: 'Luffy',
      lastName: 'Monkey',
      username: 'pirate_king',
      email: 'monkey@luffy.co',
      password: 'qwerty123445',
      confirmPassword: 'qwerty123445',
    };

    testUser = await User.create(userObject);
    // generate test token
    userToken = await authHelper.generateToken({ id: testUser.id });
  });
  describe('Update user profile', () => {
    it('it should update user profile', (done) => {
      const data = {
        username: 'northern_lights',
        bio: 'Stargazing and Food',
        image: 'image',
      };

      chai
        .request(app)
        .put('/api/user')
        .set('token', userToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should update user profile with an image', (done) => {
      chai
        .request(app)
        .put('/api/user')
        .set('token', userToken)
        .attach('image', fs.readFileSync(`${__dirname}/mock/sample.png`), 'sample.png')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should return an error message, Once you don\'t update anything to your profile', (done) => {
      chai
        .request(app)
        .put('/api/user')
        .set('token', userToken)
        .send()
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.deep.equal('Nothing changed in your Profile');
          expect(res.statusCode).to.deep.equal(400);
          done();
        });
    });
  });
});

describe('Get a user profile', () => {
    it('it should get a user profile', (done) => {
      chai
        .request(app)
        .get('/api/profiles/northern_lights')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });

    it('it should get a non existant user profile', (done) => {
      chai
        .request(app)
        .get('/api/profiles/kotowaru')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
});

describe('GET All Profile', () => {
  it('should get all profile', () => {
    chai
      .request(app)
      .get('/api/profiles')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.profiles).to.be.an('array');
      });
  });
});
