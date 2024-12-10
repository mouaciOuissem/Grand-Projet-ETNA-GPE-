'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('UserDetails', 'nationality', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'française'
    });
    await queryInterface.addColumn('UserDetails', 'res_card_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserDetails', 'separated', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserDetails', 'separated_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserDetails', 'department');
    await queryInterface.removeColumn('UserDetails', 'nationality');
    await queryInterface.removeColumn('UserDetails', 'res_card_date');
    await queryInterface.removeColumn('UserDetails', 'separated');
    await queryInterface.removeColumn('UserDetails', 'separated_date');
  }
};
