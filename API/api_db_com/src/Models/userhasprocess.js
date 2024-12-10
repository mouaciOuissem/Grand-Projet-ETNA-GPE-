'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHasProcess extends Model {
    static associate(models) {
      UserHasProcess.belongsTo(models.User, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
      });

      UserHasProcess.belongsTo(models.Status, {
        foreignKey: 'StatusId',
        as: 'Status',
        onDelete: 'CASCADE',
      });

      UserHasProcess.belongsTo(models.Process, {
        foreignKey: 'ProcessId',
        as: 'Process',
        onDelete: 'CASCADE',
      });
    }
  }
  UserHasProcess.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ProcessId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    UserId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    StatusId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserHasProcess',
    timestamps: true,
    freezeTableName: true
  });
  return UserHasProcess;
};