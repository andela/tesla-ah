import { expect } from 'chai';
import sendMail from '../src/helpers/mailer';

describe('Should send email successfully', () => {
  const email = 'eliemugenzi@gmail.com';
  const action = 'Greeting';
  const data = {
    resource: 'articles',
    action: 'comment',
    user: {
      id: 1,
      email: 'eliemugenzi@gmail.com',
      username: 'eliemugenzi'
    },
    inAppMessage: 'Hello Elie',
    emailMessage: 'Hello Elie'
  };

  it('Can send email', async () => {
    const response = await sendMail(email, action, data);
    expect(response).to.be.an('object');
  });
});
