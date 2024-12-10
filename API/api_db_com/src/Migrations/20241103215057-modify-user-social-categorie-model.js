'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SocialCategorie', 'without_activity', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('SocialCategorie', 'apprenticeship', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SocialCategorie', 'without_activity');
    await queryInterface.removeColumn('SocialCategorie', 'apprenticeship');
  }
};
