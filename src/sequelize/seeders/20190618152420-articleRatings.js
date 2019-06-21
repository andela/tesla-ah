module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'ArticleRatings',
    [
      {
        userId: 1,
        slug: 'This_is_andela_2433546h34',
        ratings: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        slug: 'This_is_andela_2433546h34',
        ratings: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        slug: 'This_is_andela_2433546h34',
        ratings: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        slug: 'This_is_muhabura_2433546h34',
        ratings: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        slug: 'This_is_andela_2433546h34',
        ratings: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        slug: 'This_is_andela_2433546h34',
        ratings: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  )
};
