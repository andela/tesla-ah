/* eslint-disable prefer-destructuring */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import models from '../src/sequelize/models';
import token from '../src/helpers/Token.helper';
import signupMock from './mock/signup';
import articleMock from './mock/articles';

const { User } = models;

// @Mock-Data
const { validInfo, unverifiedInfo, invalidInfo } = signupMock;
const { validArticle, invalidArticle, updatedArticle } = articleMock;

chai.use(chaiHttp);

let validToken, slug, unverifiedToken;
let updatedSlug, invalidToken;
describe('POST and GET /api/articles', () => {
  before('Before any test, Create A new user', async () => {
    const user = await User.create({
      bio: validInfo.bio,
      email: validInfo.email,
      username: validInfo.username,
      verified: true
    });
    const user1 = await User.create({
      bio: unverifiedInfo.bio,
      email: unverifiedInfo.email,
      username: unverifiedInfo.username,
      verified: false
    });
    validToken = await token.generateToken(user.dataValues);
    unverifiedToken = await token.generateToken(user1.dataValues);
  });

  it('it should return an error if there is no any article', (done) => {
    chai
      .request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        // expect(res.body.error).to.deep.equal('Whoops! No Articles found!');
        done();
      });
  });

  it('it should return an error if the user is not verified', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('token', `${unverifiedToken}`)
      .send(validArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('string');
        expect(res.body.error).to.deep.equal('Please Verify your account, first!');
        done();
      });
  });

  it('it should return an error if the request is not valid', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('token', `${validToken}`)
      .send(invalidArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('string');
        done();
      });
  });

  it('it should create a new article', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('token', `${validToken}`)
      .send(validArticle)
      .end((err, res) => {
        slug = res.body.article.slug;
        expect(res.body).to.be.an('object');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });

  it('it should get all articles', (done) => {
    chai
      .request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });

  it('it should get one article', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${slug}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });
});

describe('PUT and DELETE /api/articles/:slug', () => {
  before('Before any test, Create A new user', async () => {
    const user = await User.create({
      bio: invalidInfo.bio,
      email: invalidInfo.email,
      username: invalidInfo.username,
      verified: true
    });
    const user1 = await User.create({
      bio: unverifiedInfo.bio,
      email: unverifiedInfo.email,
      username: unverifiedInfo.username,
      verified: false
    });
    invalidToken = await token.generateToken(user.dataValues);
    unverifiedToken = await token.generateToken(user1.dataValues);
  });

  it('', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('token', `${validToken}`)
      .send(validArticle)
      .end((err, res) => {
        updatedSlug = res.body.article.slug;
        expect(res.body).to.be.an('object');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });

  it('it should return an error if the user is not verified', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('token', `${unverifiedToken}`)
      .send(validArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(403);
        expect(res.body.error).to.be.an('string');
        expect(res.body.error).to.deep.equal('Please Verify your account, first!');
        done();
      });
  });

  it('it should return error msg if the logged in user is not the owner of the article', (done) => {
    chai
      .request(app)
      .put(`/api/articles/${slug}`)
      .set('token', `${invalidToken}`)
      .send(updatedArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(403);
        expect(res.body.error).to.deep.equal('Sorry!, you are not the owner of this slug');
        done();
      });
  });

  it('it should return an error message for the nonexisting slug', (done) => {
    chai
      .request(app)
      .put('/api/articles/adndfnlkafnamfm')
      .set('token', `${validToken}`)
      .send(updatedArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(404);
        expect(res.body.error).to.deep.equal('Slug Not found!');
        done();
      });
  });

  it('it should return an error if the request for updating an article is not valid', (done) => {
    chai
      .request(app)
      .put(`/api/articles/${slug}`)
      .set('token', `${validToken}`)
      .send(invalidArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(400);
        expect(res.body.error).to.be.an('string');
        done();
      });
  });

  it('it should update an existing article', (done) => {
    chai
      .request(app)
      .put(`/api/articles/${slug}`)
      .set('token', `${validToken}`)
      .send(updatedArticle)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(200);
        expect(res.body.message).to.deep.equal('Article updated successfully');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });

  it('it should delete an existing article', (done) => {
    chai
      .request(app)
      .delete(`/api/articles/${updatedSlug}`)
      .set('token', `${validToken}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(200);
        expect(res.body.message).to.deep.equal('Article deleted successfully!');
        done();
      });
  });
});
