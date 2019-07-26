import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import fs from 'fs';

import app from '../src/index';
import tokenHelper from '../src/helpers/Token.helper';
import models from '../src/sequelize/models';
import mockUsers from './mock/users';

dotenv.config();
chai.use(chaiHttp);

let testUser, userToken;

describe('Image Upload', () => {
  before(async () => {
    testUser = await models.User.create(mockUsers.user3);
    userToken = await tokenHelper.generateToken({ id: testUser.dataValues.id });
  });

  it('should upload and image', (done) => {
    chai
      .request(app)
      .post('/api/upload/image')
      .set('token', userToken)
      .attach('image', fs.readFileSync(`${__dirname}/mock/sample.png`), 'sample.png')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  }).timeout(10000);

  it('should not upload and image with invalid path', (done) => {
    chai
      .request(app)
      .post('/api/upload/image')
      .set('token', userToken)
      .attach('imsage', fs.readFileSync(`${__dirname}/mock/sample.png`), 'sample.png')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  }).timeout(10000);
});
