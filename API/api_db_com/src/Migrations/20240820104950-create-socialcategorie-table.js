'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('SocialCategorie', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      UserdetailsId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'UserDetails',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      self_employed: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      auto_entrepreneur: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      activity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      student: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      employee: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      other: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('SocialCategorie');
  }
};
