import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

chai.use(chaiHttp);
describe('Unavailable URL', () => {
  it('Should return 200 when youbtry to access root url', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('Should return an error message, Once you tried to access the unavailable URL', (done) => {
    chai
      .request(app)
      .get('/fadfasfasfafafdafafda')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.deep.equal('Page Not found');
        done();
      });
  });
});
