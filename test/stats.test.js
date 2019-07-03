import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Article reading stats', () => {
  it('should be able to view the number of people who read the article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/views')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to view the number of comments on an article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/comments/count')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to view the number of facebook shares on an article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/shares/facebook')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to view the number of twitter shares on an article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/shares/twitter')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to view the number of email shares on an article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/shares/email')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should be able to view the number of shares on an article', (done) => {
    chai
      .request(server)
      .get('/api/articles/73H7812/shares')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
