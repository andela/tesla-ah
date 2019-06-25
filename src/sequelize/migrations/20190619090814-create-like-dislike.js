export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LikeDislikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      dislikes: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('LikeDislikes', ['likes'], {
      type: 'check',
      where: {
        likes: [0, 1]
      }
    });

    return queryInterface.addConstraint('LikeDislikes', ['dislikes'], {
      type: 'check',
      where: {
        dislikes: [0, 1]
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('LikeDislikes')
};
