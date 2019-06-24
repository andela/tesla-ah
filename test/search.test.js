import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/index';

chai.use(chaiHttp);

describe('GET /api/articles/author=<author\'s name>', () => {
  it('It should return an error message if you provided the key which is not author,title,tag or keywords', () => {
    chai
      .request(app)
      .get('/api/articles?fdsfasf=noffffffffffffff')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('You made a Bad Request!');
      });
  });

  it('It should return an error message if you provided author,title,tag or keywords  value which does not have at least three character', () => {
    chai
      .request(app)
      .get('/api/articles?author=nf')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal("You should have provided at least 3 characters long for author's name");
      });
  });

  it('It should return an error message if it doesn\'t find the provided title', () => {
    chai
      .request(app)
      .get('/api/articles?author=noffffffffffffff')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('This Author with username of noffffffffffffff not exists!');
      });
  });

  it('It should make a search and fetch all articles written by a certain author', () => {
    chai
      .request(app)
      .get('/api/articles?author=Uhiriwe')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).to.be.a('string');
      });
  });
});

describe('GET /api/articles/title=<article\'s title>', () => {
  it('It should return an error message if you provided author,title,tag or keywords  value which does not have at least three character', () => {
    chai
      .request(app)
      .get('/api/articles?title=nf')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('You should have provided at least 3 characters long for title');
      });
  });
  it('It should return an error message if it doesn\'t find the provided title', () => {
    chai
      .request(app)
      .get('/api/articles?title=noffffffffffffff')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('No Articles with that title, so far!');
      });
  });

  it('It should make a search and fetch all articles which has the same provided title', () => {
    chai
      .request(app)
      .get('/api/articles?title=article two')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).to.be.a('string');
      });
  });
});

describe('GET /api/articles/tag=<article\'s tag>', () => {
  it('It should return an error message if you provided author,title,tag or keywords  value which does not have at least three character', () => {
    chai
      .request(app)
      .get('/api/articles?tag=nf')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('You should have provided at least 3 characters long for tag');
      });
  });
  it('It should return an error message if it doesn\'t find the provided tag', () => {
    chai
      .request(app)
      .get('/api/articles?tag=noffffffffffffff')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('No Articles with that tag, so far!');
      });
  });

  it('It should make a search and fetch all articles which has the same provided tag', () => {
    chai
      .request(app)
      .get('/api/articles?tag=reactjs')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).to.be.a('string');
      });
  });
});

describe('GET /api/articles/keywords=<any keywords>', () => {
  it('It should return an error message if you provided author,title,tag or keywords  value which does not have at least three character', () => {
    chai
      .request(app)
      .get('/api/articles?keywords=nf')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('You should have provided at least 3 characters long for keywords');
      });
  });
  it('It should return an error message if there\'s any response for the request made', () => {
    chai
      .request(app)
      .get('/api/articles?keywords=noffffffffffffff')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.deep.equal('No Articles with that Keyword found, so far!');
      });
  });

  it('It should make a search and fetch all articles which has the same provided tag', () => {
    chai
      .request(app)
      .get('/api/articles?keywords=reactjs')
      .send((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).to.be.a('string');
      });
  });
});
