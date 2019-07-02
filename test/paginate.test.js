import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/index';

chai.use(chaiHttp);
describe('GET /api/articles/page=<pageNumber>&limit=<number of limit>', () => {
  it('It should return an error message if you provided the page number and limit which is less than or equal to zero ', () => {
    chai
      .request(app)
      .get('/api/articles?page=0&limit=0')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.statusCode).to.deep.equal(400);
        expect(res.body.error).to.deep.equal('Invalid request');
      });
  });

  it('It should make a search and fetch the articles based on the provided pageNumber and limit number of the pages', () => {
    chai
      .request(app)
      .get('/api/articles?page=1&limit=10')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
      });
  });
  it('Should return an error message', () => {
    chai.request(app).get('/api/articles?page=-1&limit=2').end((err, res) => {
      expect(res.body).to.be.an('object');
      expect(res.status).to.equal(400);
    });
  });
});
