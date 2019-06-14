

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
    },
    {
      firstName: 'Uhiriwe',
      lastName: 'Audace',
      username: 'Audace',
      email: 'u.audace@gmail.com',
      password: 'Uhiriwe1!',
      bio: '',
      image: '',
      dateOfBirth: '12/12/1999',
      gender: '',
      provider: '',
      socialId: '',
      verified: 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {}),
};
