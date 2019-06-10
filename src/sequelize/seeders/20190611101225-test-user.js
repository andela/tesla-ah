

module.exports = {
  up: queryInterface =>
  /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      */

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
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {}),
};
