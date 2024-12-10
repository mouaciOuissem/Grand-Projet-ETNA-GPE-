'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserFiscalDetails', {
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
      salary_1: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      salary_2: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      salary_3: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      sales_1: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      sales_2: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      sales_3: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      self_employed_business_profits: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      in_couple: {
        type: Sequelize.TINYINT,
        allowNull: true
      },
      waiting_child: {
        type: Sequelize.TINYINT,
        allowNull: true
      },
      child_number: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      owner: {
        type: Sequelize.TINYINT,
        allowNull: true
      },
      housed_free_of_charge: {
        type: Sequelize.TINYINT,
        allowNull: true
      },
      housing_allowance_1: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      housing_allowance_2: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      housing_allowance_3: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      aah_1: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      aah_2: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      aah_3: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      annual_investment_income: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      other_resources_received_1: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      other_resources_received_2: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      other_resources_received_3: {
        type: Sequelize.BIGINT,
        allowNull: true
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
    await queryInterface.dropTable('UserFiscalDetails');
  }
};
