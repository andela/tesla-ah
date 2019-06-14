

module.exports = {
  up: queryInterface =>
  /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.
        */

    // eslint-disable-next-line implicit-arrow-linebreak
    queryInterface.bulkInsert('Users', [{
      firstName: 'Mireille',
      lastName: 'Niwemuhuza',
      username: 'mifeille',
      email: 'nimilleer@gmail.com',
      password: 'Mireille1!',
      bio: '',
      image: '',
      dateOfBirth: '12/12/2000',
      gender: '',
      provider: '',
      socialId: '',
      verified: 'false',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {}),
};
