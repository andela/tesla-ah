module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [{
    slug: '73H7812',
    title: 'How to survive at Andela',
    authorId: '1',
    description: 'YoYo',
    body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    image: '',
    readtime: '1min',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    slug: '73H99992',
    title: 'Wow',
    description: 'YoYo',
    authorId: '2',
    body:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    image: '',
    readtime: '1min',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
