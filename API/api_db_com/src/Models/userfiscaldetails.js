'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFiscalDetails extends Model {
    static associate(models) {
      UserFiscalDetails.belongsTo(models.UserDetails, {
        foreignKey: 'UserdetailsId',
        as: 'userFiscalDetails',
        onDelete: 'CASCADE',
      });
    }
  }
  UserFiscalDetails.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    UserdetailsId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    salary_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    salary_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    salary_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    in_couple: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    waiting_child: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    child_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    waiting_child_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    owner: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    sales_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    sales_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    sales_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    self_employed_business_profits: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    housed_free_of_charge: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    housing_allowance_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    housing_allowance_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    housing_allowance_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    aah_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    aah_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    aah_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    annual_investment_income: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    other_resources_received_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    other_resources_received_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    other_resources_received_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    rso: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    leave_job: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    leave_job_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lost_activity: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_activity_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lost_other_resources_received: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_other_resources_received_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    social_security_income_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    social_security_income_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    social_security_income_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_social_security_income: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_social_security_income_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    food_pension_income_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    food_pension_income_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    food_pension_income_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_food_pension_income: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_food_pension_income_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    other_pension_received_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    other_pension_received_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    other_pensions_received_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_other_pensions: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_other_pensions_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rent_received_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    rent_received_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    rent_received_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_rent: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_rent_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    financial_assistance_incomes_1: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    financial_assistance_incomes_2: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    financial_assistance_incomes_3: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_financial_assistance_incomes: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    lost_financial_assistance_incomes_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    invested_money_incomes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'UserFiscalDetails',
    timestamps: true,
    freezeTableName: true
  });
  return UserFiscalDetails;
};