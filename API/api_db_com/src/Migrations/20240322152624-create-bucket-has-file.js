'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BucketHasFile', {
      BucketId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Bucket',
          key: 'id',
        }
      },
      FileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'File',
          key: 'id',
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BucketHasFile');
  }
};
