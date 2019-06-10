import { expect } from 'chai';
import mailTemplate from '../src/helpers/MailTemplate.helper';

const mailTo = 'elie.mugenzi@andela.com';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJmaXJzdE5hbWUiOiJFbGllIiwibGFzdE5hbWUiOiJNdWdlbnppIiwiZW1haWwiOiJlbGllQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDA4JEc1ZHBOTlhQamtwUnp6MnhQaDRQVi5pWUtLZmhTYnNuREM5QnRwZk9VenhjdFZBb1RmTEgyIiwidXNlcm5hbWUiOiJlbGllIiwiYmlvIjpudWxsLCJnZW5kZXIiOiJNIiwidmVyaWZpZ';
const names = 'Elie Mugenzi';

describe('Mail Template Tests', () => {
  const template = mailTemplate({
    to: mailTo,
    token,
    names
  });
  expect(template).to.be.a('string');
});
