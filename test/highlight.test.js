import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../src/index';
import db from '../src/sequelize/models';
import tokenHelper from '../src/helpers/Token.helper';


const { User, Article } = db;
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const { expect } = chai;

dotenv.config();

let newArticle;
const highlight = {
  highlightText: 'Rwanda',
  comment: 'Thank you',
  occurencyNumber: 1
};
const invalidHighlight = {
  highlightText: 'Blablablabla',
  comment: 'Thank you',
  occurencyNumber: 1
};

describe('Highlight the Article', () => {
  let token, highlightId;
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

    const article = {
      title: 'Andela Kigali Launch',
      description: 'Andela Rwanda, a technology company specializing in training software engineers on Thursday last week launched its Kigali office. Its new offices are housed within the University of Rwanda - College of Science and Technology, in Muhabura Block.',
      body: 'Andela Rwanda, a technology company specializing in training software engineers on Thursday last week launched its Kigali office. Its new offices are housed within the University of Rwanda - College of Science and Technology, in Muhabura Block. The firm made their debut in Rwanda in July last year, with pan-African hub, the first of its kind. This was followed by the announcement in October of Clement Uwajeneza as the Country Director. The firm has a Memorandum of Understanding with the government to recruit, train and connect to market about 500 young software engineers in the country',
      tagList: ['Tech', 'Kigali'],
      authorId: newUser.id,
      slug: 'slyg',
      readtime: '1 min'
    };
    newArticle = await Article.create(article);
  });
  it('should highlight with comment or without', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/highlight`)
      .set('token', token)
      .send(highlight)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.Message).to.be.a('string');
        highlightId = res.body.data.id;
        done();
      });
  });
  it('should raise an error when the user highlights the same text ', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/highlight`)
      .set('token', token)
      .send(highlight)
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.Message).to.be.a('string');
        done();
      });
  });
  it('should raise an error when the highlighter text exist', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/highlight`)
      .set('token', token)
      .send(invalidHighlight)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.Message).to.be.a('string');
        done();
      });
  });
  it('should raise an error when the user is not logged in', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/highlight`)
      .set('token', ' ')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it('should be able to share hightlights', (done) => {
    chai
      .request(server)
      .get(`/api/articles/${newArticle.dataValues.slug}/highlights/${highlightId}/share/twitter`)
      .set('token', token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to share hightlights', (done) => {
    chai
      .request(server)
      .get(`/api/articles/${newArticle.slug}/highlights/${highlightId}/share/facebook`)
      .set('token', token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to share hightlights', (done) => {
    chai
      .request(server)
      .get(`/api/articles/${newArticle.dataValues.slug}/highlights/${highlightId}/share/email`)
      .set('token', token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should check if the highlight belongs to the article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/highlights/1/share/email')
      .set('token', token)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
