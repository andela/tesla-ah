module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Articles', [
    {
      slug: '73H7812',
      title: 'How to survive at Andela',
      description: 'YoYo',
      authorId: 1,
      blocked: false,
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      readtime: '1min'
    },
    {
      slug: '73H99992',
      title: 'Wow',
      description: 'YoYo',
      authorId: 2,
      blocked: false,
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      readtime: '1min'
    }
  ]),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
