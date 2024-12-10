'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProcessHasInput extends Model {
    static associate(models) {
      ProcessHasInput.belongsTo(models.Process, {
        foreignKey: 'ProcessId',
        onDelete: 'CASCADE' 
      });

      ProcessHasInput.belongsTo(models.Input, {
        foreignKey: 'InputId',
        onDelete: 'CASCADE'
      });
    }
  }
  ProcessHasInput.init({
    ProcessId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    InputId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    page: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'ProcessHasInput',
    timestamps: true,
    freezeTableName: true
  });
  return ProcessHasInput;
};