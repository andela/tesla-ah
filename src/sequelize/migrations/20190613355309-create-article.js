/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    slug: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    title: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    readtime: {
      allowNull: false,
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    body: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    tagList: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: []
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    authorId: {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
