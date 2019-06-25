import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import server from '../src/index';
import db from '../src/sequelize/models';
import tokenHelper from '../src/helpers/Token.helper';

const { User, Article } = db;

const { expect } = chai;
chai.use(chaiHttp);

let token;

dotenv.config();
describe('Articles ratings', () => {
  let newArticle;
  let Atoken;
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

    Atoken = await tokenHelper.generateToken({ id: newUser.id });

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
  describe('Ratings Report', () => {
    it('Should return 200 when user logged in successful', (done) => {
      chai.request(server)
        .post('/api/auth/login')
        .send({
          email: 'elie@gmail.com',
          password: 'Rukundo1!',
        })
        .end((err, res) => {
          ({ token } = res.body.data);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return 200 when article ratings found and calcurated successfuly', (done) => {
      chai.request(server)
        .post(`/api/ratings/articles/${newArticle.slug}`)
        .set('token', `${Atoken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return 404 when article ratings not found', (done) => {
      chai.request(server)
        .post('/api/ratings/articles/gf2433546h34')
        .set('token', `${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
