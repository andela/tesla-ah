module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    {
      slug: '73H7812',
      title: 'How to survive at Andela',
      description: 'YoYo',
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      readtime: '2 min'
    },
    {
      slug: '73H99992',
      title: 'Wow',
      description: 'YoYo',
      readtime: '2 min',
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'This_is_andela_2433546h34',
      title: 'Wow',
      description: 'YoYo',
      readtime: '2 min',
      body:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
