import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import models from '../src/sequelize/models';
import tokenHelper from '../src/helpers/Token.helper';


const { expect } = chai;
chai.use(chaiHttp);
dotenv.config();
let userOneToken,
  userTwoToken,
  adminToken,
  userOneObject,
  userTwoObject,
  adminObject,
  testUserOne,
  testUserTwo,
  commentId,
  commentTwoId,
  articleOne,
  articleTwo,
  testAdmin;

describe('Comments', () => {
  before(async () => {
    userOneObject = {
      firstName: 'Aurore',
      lastName: 'Kay',
      username: 'kay',
      email: 'kay@luffy.co',
      password: process.env.TEST_USER_PSW,
      confirmPassword: process.env.TEST_USER_PSW
    };

    testUserOne = await models.User.create(userOneObject);
    const userOneId = testUserOne.dataValues.id;
    // generate test token
    userOneToken = await tokenHelper.generateToken({ id: userOneId });

    userTwoObject = {
      firstName: 'Emily',
      lastName: 'Ben',
      username: 'Ben',
      email: 'ben@luffy.co',
      password: process.env.TEST_USER_PSW,
      confirmPassword: process.env.TEST_USER_PSW
    };

    testUserTwo = await models.User.create(userTwoObject);
    // generate test token
    userTwoToken = await tokenHelper.generateToken({ id: testUserTwo.dataValues.id });

    adminObject = {
      firstName: 'admin',
      lastName: 'admin',
      username: 'admin',
      email: 'admin@luffy.co',
      password: process.env.TEST_USER_PSW,
      confirmPassword: process.env.TEST_USER_PSW,
      isAdmin: process.env.IS_ADMIN
    };

    testAdmin = await models.User.create(adminObject);

    // generate test token
    adminToken = await tokenHelper.generateToken({ id: testAdmin.dataValues.id });
    articleOne = {
      slug: '73H7812',
      title: 'How to survive at Andela',
      description: 'YoYo',
      body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      authorId: userOneId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await models.Article.create(articleOne);

    articleTwo = {
      slug: '73H99992',
      title: 'Wow',
      description: 'YoYo',
      body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      authorId: userOneId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await models.Article.create(articleTwo);
  });
  it('should let a user comment an article', (done) => {
    chai
      .request(server)
      .post('/api/articles/73H7812/comments')
      .set('token', userOneToken)
      .send({
        comment: 'I love this article!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        commentId = res.body.data.Id;
        done();
      });
  });
  it('should let a user comment an article', (done) => {
    chai
      .request(server)
      .post('/api/articles/73H7812/comments')
      .set('token', userTwoToken)
      .send({
        comment: 'Amazing!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        commentTwoId = res.body.data.Id;
        done();
      });
  });
  it('should let a user edit a comment', (done) => {
    chai
      .request(server)
      .patch(`/api/articles/comments/${commentId}`)
      .set('token', userOneToken)
      .send({
        comment: 'Wooow! I love this article!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let only the owner of the comment edit it!', (done) => {
    chai
      .request(server)
      .patch(`/api/articles/comments/${commentId}`)
      .set('token', userTwoToken)
      .send({
        comment: 'Wooow! I love this article!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let the owner of the comment delete it!', (done) => {
    chai
      .request(server)
      .delete(`/api/articles/comments/${commentId}`)
      .set('token', userOneToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should only allow the admin and the owner of the comment to delete it!', (done) => {
    chai
      .request(server)
      .delete(`/api/articles/comments/${commentTwoId}`)
      .set('token', userOneToken)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an error if the article does not exist!', (done) => {
    chai
      .request(server)
      .post(`/api/articles/73H99992/comments/${commentTwoId}`)
      .set('token', adminToken)
      .send({
        comment: 'You are right!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let the user comment on a comment!', (done) => {
    chai
      .request(server)
      .post(`/api/articles/73H7812/comments/${commentTwoId}`)
      .set('token', adminToken)
      .send({
        comment: 'You are right!'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let the admin delete any comment!', (done) => {
    chai
      .request(server)
      .delete(`/api/articles/comments/${commentTwoId}`)
      .set('token', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let the user get an article with its comments!', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/comments')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
