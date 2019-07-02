import { expect } from 'chai';
import template from '../src/helpers/mailer/templates/notification';

describe('Email notification template tests..,', () => {
  it('Should return an object of email data', () => {
    expect(template({ message: 'Hello world' })).to.be.an('object');
  });
});
