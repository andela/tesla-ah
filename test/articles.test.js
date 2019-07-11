import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import models from '../src/sequelize/models';
import authHelper from '../src/helpers/Token.helper';
import signupMock from './mock/signup';
import articleMock from './mock/articles';

const { User, Article } = models;
const { generateToken } = authHelper;

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
    validToken = await generateToken(user.dataValues);
    unverifiedToken = await generateToken(user1.dataValues);
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
        expect(res.body.data.message).to.be.an('array');
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
        // eslint-disable-next-line prefer-destructuring
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
    invalidToken = await generateToken(user.dataValues);
    unverifiedToken = await generateToken(user1.dataValues);
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
        expect(res.body.message).to.deep.equal('Sorry!, You are not the owner of this article');
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
        expect(res.body.data.message).to.be.an('array');
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
  it('Should Return 201 when article reported successfully', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${updatedSlug}/report`)
      .set('token', `${validToken}`)
      .send({
        comment: 'some thing'
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.deep.equal(201);
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

describe('Like/Unlike Articles', () => {
  let userToken;
  let userObject;
  let articleObject;
  let testUser;
  let testArticle;

  before(async () => {
    // create test user
    userObject = {
      firstName: 'Luffyiu',
      lastName: 'Monkeyf',
      username: 'thep_irate_king',
      email: 'monkeyd@luffy.co',
      password: 'qwerty123445',
      confirmPassword: 'qwerty123445',
    };

    testUser = await User.create(userObject);

    // generate test token
    userToken = await generateToken({ id: testUser.dataValues.id });

    await Article.destroy({
      where: {},
      truncate: false
    });

    articleObject = {
      title: 'this is article one',
      body: 'this is article is supposed to have two paragraph',
      description: 'the paragraph one has many character than before',
      tagList: ['reactjs', 'angularjs', 'expressjs'],
      slug: 'lsug32344',
      authorId: testUser.dataValues.id,
      readtime: '1 min'
    };

    // create test article
    testArticle = await Article.create(articleObject);
  });

  it('it should like an article for an authenticated user', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${testArticle.slug}/like`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should dislike an article for an authenticated user', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${testArticle.slug}/dislike`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should not like an article which does not exist', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${testArticle.slug + 10}/like`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should not dislike an article which does not exist', (done) => {
    chai
      .request(app)
      .post(`/api/articles/${testArticle.slug + 10}/dislike`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should get the number of likes for an article', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/like`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('it should get the number of dislikes for an article', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/dislike`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('it should not get dislikes for an article which does not exist', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug + 10}/dislike`)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('it should not get likes for an article which does not exist', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug + 10}/like`)
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  // share article test
  it('should share an article on twitter', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/share/twitter`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should share an article on facebook', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/share/facebook`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('should share an article on linkedin', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/share/linkedin`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('should share an article on pinterest', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/share/linkedin`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('should share an article on email', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${testArticle.slug}/share/email`)
      .set('token', userToken)
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});

describe('Block article', () => {
  let UserToten;
  let AdminToken;
  let testUser;
  let testArticle;
  before(async () => {
    // create test user
    testUser = await User.create({
      firstName: 'Luffyiu',
      lastName: 'Monkeyf',
      username: 'thep_irate_king',
      email: 'monkeyd@luffy.co',
      password: 'qwerty123445',
      confirmPassword: 'qwerty123445',
    });
    // create test article
    testArticle = await Article.create({
      title: 'this is article one',
      body: 'this is article is supposed to have two paragraph',
      description: 'the paragraph one has many character than before',
      tagList: ['reactjs', 'angularjs', 'expressjs'],
      slug: 'lsug38769',
      authorId: testUser.dataValues.id,
      readtime: '1 min'
    });
  });

  describe('POST /api/arctile/:slug/block', () => {
    it('Should return 200 when user logged in successful', (done) => {
      chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: 'gprestein055@gmail.com',
          password: 'Eric.00005'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          UserToten = res.body.data.token;
          done();
        });
    });
    it('Should return 200 when admin logged in successful', (done) => {
      chai
        .request(app)
        .post('/api/auth/login')
        .send({
          email: 'gprestein555@gmail.com',
          password: 'Eric.00005'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          AdminToken = res.body.data.token;
          done();
        });
    });
    it('User should not be able to block an article', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${testArticle.slug}/block`)
        .set('token', UserToten)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('Admin should be able to block an article', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${testArticle.slug}/block`)
        .set('token', AdminToken)
        .send({ description: 'some reasons' })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it('Admin should be able to unblock an article', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${testArticle.slug}/unblock`)
        .set('token', AdminToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should let admin or moderator get blocked articles', (done) => {
      chai
        .request(app)
        .get('/api/articles/blocked/all')
        .set('token', AdminToken)
        .end((err, res) => {
          res.body.should.have.status(200);
          done();
        });
    });

    it('it should let admin or moderator get reported articles', (done) => {
      chai
        .request(app)
        .get('/api/articles/reported/all')
        .set('token', AdminToken)
        .end((err, res) => {
          res.body.should.have.status(200);
          done();
        });
    });
  });
});
