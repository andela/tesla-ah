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

describe('User should bookmark article', () => {
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

    const article = {
      title: 'Andela Kigali Launch',
      description: 'Andela Rwanda, a technology company specializing in training software engineers on Thursday last week launched its Kigali office. Its new offices are housed within the University of Rwanda - College of Science and Technology, in Muhabura Block. ',
      body: 'Andela Rwanda, a technology company specializing in training software engineers on Thursday last week launched its Kigali office. Its new offices are housed within the University of Rwanda - College of Science and Technology, in Muhabura Block. The firm made their debut in Rwanda in July last year, with pan-African hub, the first of its kind. This was followed by the announcement in October of Clement Uwajeneza as the Country Director. The firm has a Memorandum of Understanding with the government to recruit, train and connect to market about 500 young software engineers in the country',
      tagList: ['Tech', 'Kigali'],
      authorId: newUser.id,
      slug: 'slug',
      readtime: 'Less than 1min'
    };
    newArticle = await Article.create(article);
  });
  it('should bookmark the article ', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/bookmark`)
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should delete the bookmark if the user bookmarks the same bookmarked article again', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/bookmark`)
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should raise an error when the user is not logged in', (done) => {
    chai.request(server)
      .post(`/api/articles/${newArticle.slug}/bookmark`)
      .set('token', ' ')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it('should get all bookmarked article by a specific user', (done) => {
    chai.request(server)
      .get('/api/bookmarks')
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
