module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Articles', [
    {
      slug: '73H7812',
      title: 'How to survive at Andela',
      description: 'YoYo',
      authorId: 11,
      blocked: false,
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      createdAt: new Date(),
      updatedAt: new Date(),
      readtime: '2 min',
      views: 0,
      categoryName: 'other'
    },
    {
      slug: '73H99992',
      title: 'Wow',
      description: 'YoYo',
      authorId: 2,
      blocked: false,
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      createdAt: new Date(),
      updatedAt: new Date(),
      readtime: '1min',
      views: 0,
      categoryName: 'other'
    },
    {
      slug: 'This_is_andela_2433546h34',
      title: 'Wow',
      description: 'YoYo',
      readtime: '2 min',
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 4,
      views: 0,
      categoryName: 'other'
    }
  ]),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
