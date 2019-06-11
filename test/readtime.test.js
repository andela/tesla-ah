import { expect } from 'chai';
import readTime from '../src/helpers/ReadTime.helper';


describe('Read time tests', () => {
  it('should return a beautiful read time', () => {
    const body = `Since joining Andela’s Bootcamp, 
    that was the first time to know how to test my codes,
    because there are some situations where the software( like a website) 
    is being broken in production(means when the users are using that product and face the technical bugs).
    The way this was a challenge to me is that I had to learn it fast and implement them immediately.
    I found how important it is, the way you target every block of code as input and
    expect each possible output in order to catch some errors and correct them before the product
    is going to get deployed. The main thing I learned from this challenge is that 
    I have to make sure my codes are bug-free before getting deployed and make sure my tests are covering every 
    block of codes. How I adapted to this challenge is, I spent a lot of sleepless nights figuring out how 
   to write my tests, I didn’t know anything about Travis CI and I got several emails that my builds were failing. 
   The main key is working hard, ask around and do more research to get your work done.\nGit workflow was another challenge I faced.
    I tried it before, but I never tried the feature-branch workflow. 
    I found that workflow was awesome because it helps you manage the project tasks and work them into branches. 
    The reason it was a challenge is that we had to work in several branches and merge our work into the main branch and sometimes you face some merge conflicts. 
    I didn’t know how to resolve conflicts, but I tried to make some research about it, ask my colleagues how to resolve them and luckily 
    I got my work really organized on Github.`;
    expect(readTime(body)).to.equal('2 min');
  });

  it('should get a less than a minute read time', () => {
    const body = 'This is an amazing project we are working on, Authors Haven';
    expect(readTime(body)).to.equal('Less than a minute');
  });
});
