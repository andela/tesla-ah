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
let followObject;
let testFollow;
let fobject;
let ftest;
let ftoken;
let bobject;
let btest;
let btoken;
let dobject;
let dtest;
let dtoken;
describe('User Profiles', () => {
  before(async () => {
    // eslint-disable-next-line no-unused-expressions
    // create test user
    userObject = {
      firstName: 'Luffy',
      lastName: 'Monkey',
      username: 'pirate_king',
      email: 'monkey@luffy.co',
      password: 'qwerty123445',
      confirmPassword: 'qwerty123445'
      // eslint-disable-next-line no-sequences
    };
    fobject = {
      firstName: 'espoire',
      lastName: 'mugenzie',
      username: 'espoire',
      email: 'espoiremugenzie@gmail.com',
      password: 'ericprestein',
      confirmPassword: 'ericprestein'
    };
    bobject = {
      firstName: 'diane',
      lastName: 'mahoro',
      username: 'test_user',
      email: 'mahorodiane@gmail.com',
      password: 'cooler12345',
      confirmPassword: 'cooler12345'
    };
    dobject = {
      firstName: 'diego',
      lastName: 'hirwa',
      username: 'diego',
      email: 'diegohirwa@gmail.com',
      password: 'coolest12345',
      confirmPassword: 'coolest12345'
    };

    testUser = await User.create(userObject);
    // generate test token
    userToken = await authHelper.generateToken({ id: testUser.id });

    ftest = await User.create(fobject);
    ftoken = await authHelper.generateToken({ id: ftest.id });

    btest = await User.create(bobject);
    btoken = await authHelper.generateToken({ id: btest.id });

    dtest = await User.create(dobject);
    dtoken = await authHelper.generateToken({ id: dtest.id });

    await chai
      .request(app)
      .patch('/api/profiles/test_user/follow')
      .set('token', ftoken)
      .send();
  });

  after(async () => {
    followObject = {
      firstName: 'espoire',
      lastName: 'mugenzie',
      username: 'espoire',
      email: 'espoiremugenzie@gmail.com',
      password: 'ericprestein',
      confirmPassword: 'ericprestein'
    };

    testFollow = await User.create(followObject);
    // followToken = await authHelper.generateToken({ id: testUser.id });
    await db.follows.destroy({
      where: { userId: testFollow.id },
      truncate: false
    });
    await db.User.destroy({
      where: { id: testFollow.id },
      truncate: false
    });
  });
  describe('Update user profile', () => {
    it('it should update user profile', (done) => {
      const data = {
        username: 'northern_lights',
        bio: 'Stargazing and Food',
        image: 'image'
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

  it('should give you do not follow anyone', (done) => {
    chai
      .request(app)
      .get('/api/profiles/following')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        done();
      });
  });

  it('follow users', (done) => {
    chai
      .request(app)
      .patch('/api/profiles/espoire/follow')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should unfollow user', (done) => {
    chai
      .request(app)
      .get('/api/profiles/espoire/unfollow')
      .set('token', btoken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should follow users', (done) => {
    chai
      .request(app)
      .patch('/api/profiles/pirate_king/follow')
      .set('token', ftoken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should give all your followers', (done) => {
    chai
      .request(app)
      .get('/api/profiles/followers')
      .set('token', btoken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should fail to follow a user who is already follow', (done) => {
    chai
      .request(app)
      .patch('/api/profiles/espoire/follow')
      .set('token', userToken)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.should.be.an('object');
        done();
      });
  });

  it(' should not follow yourself', (done) => {
    chai
      .request(app)
      .patch('/api/profiles/espoire/follow')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        done();
      });
  });

  it("should not get user's followers", (done) => {
    chai
      .request(app)
      .get('/api/profiles/followers')
      .set('token', dtoken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        done();
      });
  });

  it('should give who you follows', (done) => {
    chai
      .request(app)
      .get('/api/profiles/following')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it("should not unfollow user who doesn' exist", (done) => {
    chai
      .request(app)
      .patch('/api/profiles/mayoo/unfollow')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        done();
      });
  });


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
