'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `salary_1` = 0 WHERE `salary_1` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `salary_2` = 0 WHERE `salary_2` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `salary_3` = 0 WHERE `salary_3` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `in_couple` = 0 WHERE `in_couple` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `waiting_child` = 0 WHERE `waiting_child` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `child_number` = 0 WHERE `child_number` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `owner` = 0 WHERE `owner` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `sales_1` = 0 WHERE `sales_1` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `sales_2` = 0 WHERE `sales_2` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `sales_3` = 0 WHERE `sales_3` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `self_employed_business_profits` = 0 WHERE `self_employed_business_profits` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `housing_allowance_1` = 0 WHERE `housing_allowance_1` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `housing_allowance_2` = 0 WHERE `housing_allowance_2` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `housing_allowance_3` = 0 WHERE `housing_allowance_3` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `aah_1` = 0 WHERE `aah_1` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `aah_2` = 0 WHERE `aah_2` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `aah_3` = 0 WHERE `aah_3` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `annual_investment_income` = 0 WHERE `annual_investment_income` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `other_resources_received_1` = 0 WHERE `other_resources_received_1` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `other_resources_received_2` = 0 WHERE `other_resources_received_2` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `other_resources_received_3` = 0 WHERE `other_resources_received_3` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `annual_investment_income` = 0 WHERE `annual_investment_income` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `annual_investment_income` = 0 WHERE `annual_investment_income` IS NULL;'
    );
    await queryInterface.sequelize.query(
      'UPDATE `UserFiscalDetails` SET `annual_investment_income` = 0 WHERE `annual_investment_income` IS NULL;'
    );
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'in_couple', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'waiting_child', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'child_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'waiting_child_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'owner', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'self_employed_business_profits', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'annual_investment_income', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'rso', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'leave_job', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'leave_job_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_activity', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_activity_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_other_resources_received', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_other_resources_received_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'social_security_income_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'social_security_income_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'social_security_income_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_social_security_income', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_social_security_income_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'food_pension_income_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'food_pension_income_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'food_pension_income_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_food_pension_income', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_food_pension_income_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'other_pension_received_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'other_pension_received_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'other_pensions_received_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_other_pensions', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_other_pensions_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'rent_received_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'rent_received_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'rent_received_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_rent', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_rent_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'financial_assistance_incomes_1', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'financial_assistance_incomes_2', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'financial_assistance_incomes_3', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_financial_assistance_incomes', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('UserFiscalDetails', 'lost_financial_assistance_incomes_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('UserFiscalDetails', 'invested_money_incomes', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_1', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_2', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'salary_3', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'in_couple', {
      type: Sequelize.TINYINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'waiting_child', {
      type: Sequelize.TINYINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'child_number', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.removeColumn('UserFiscalDetails', 'waiting_child_date');
    await queryInterface.changeColumn('UserFiscalDetails', 'owner', {
      type: Sequelize.TINYINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_1', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_2', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'sales_3', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'self_employed_business_profits', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_1', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_2', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'housing_allowance_3', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_1', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_2', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'aah_3', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'annual_investment_income', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_1', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_2', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('UserFiscalDetails', 'other_resources_received_3', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.removeColumn('UserFiscalDetails', 'rso');
    await queryInterface.removeColumn('UserFiscalDetails', 'leave_job');
    await queryInterface.removeColumn('UserFiscalDetails', 'leave_job_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_activity');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_activity_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_other_resources_received');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_other_resources_received_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'social_security_income_1');
    await queryInterface.removeColumn('UserFiscalDetails', 'social_security_income_2');
    await queryInterface.removeColumn('UserFiscalDetails', 'social_security_income_3');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_social_security_income');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_social_security_income_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'food_pension_income_1');
    await queryInterface.removeColumn('UserFiscalDetails', 'food_pension_income_2');
    await queryInterface.removeColumn('UserFiscalDetails', 'food_pension_income_3');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_food_pension_income');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_food_pension_income_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'other_pension_received_1');
    await queryInterface.removeColumn('UserFiscalDetails', 'other_pension_received_2');
    await queryInterface.removeColumn('UserFiscalDetails', 'other_pensions_received_3');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_other_pensions');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_other_pensions_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'rent_received_1');
    await queryInterface.removeColumn('UserFiscalDetails', 'rent_received_2');
    await queryInterface.removeColumn('UserFiscalDetails', 'rent_received_3');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_rent');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_rent_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'financial_assistance_incomes_1');
    await queryInterface.removeColumn('UserFiscalDetails', 'financial_assistance_incomes_2');
    await queryInterface.removeColumn('UserFiscalDetails', 'financial_assistance_incomes_3');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_financial_assistance_incomes');
    await queryInterface.removeColumn('UserFiscalDetails', 'lost_financial_assistance_incomes_date');
    await queryInterface.removeColumn('UserFiscalDetails', 'invested_money_incomes');
  }
};
