/* eslint-disable prefer-destructuring */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/index';
// import articles from '../src/api/helpers/articlesHelper';
import signupMock from './mock/signup';
import articleMock from './mock/articles';

const { validInfo } = signupMock;
const { validArticle } = articleMock;

chai.use(chaiHttp);

let validToken;
let slug;
describe('/api/articles', () => {
  before('Before any test, Create A new user', (done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(validInfo)
      .end((err, res) => {
        validToken = res.body.data.token;
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should create a new article', (done) => {
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

  it('should get all articles', (done) => {
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

  it('should get one article', (done) => {
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
