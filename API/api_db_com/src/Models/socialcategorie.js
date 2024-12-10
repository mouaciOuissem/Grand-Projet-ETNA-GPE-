'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialCategorie extends Model {
    static associate(models) {
      SocialCategorie.belongsTo(models.UserDetails, {
        foreignKey: 'UserdetailsId',
        as: 'socialCategorie',
        onDelete: 'CASCADE',
      });
    }
    static async beforeValidate(instance) {
      const boolFields = [
        instance.self_employed,
        instance.studiant,
        instance.auto_entrepreneur,
        instance.employee,
        instance.other
      ];
      const trueCount = boolFields.filter(Boolean).length;

      if (trueCount > 1) {
        throw new Error('Only one of self_employed, studiant, or auto_entrepreneur can be true.');
      }
    }
  }
  SocialCategorie.init({
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
    self_employed: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    auto_entrepreneur: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    employee: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    without_activity: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    apprenticeship: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    other: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'SocialCategorie',
    timestamps: true,
    freezeTableName: true
  });
  return SocialCategorie;
};