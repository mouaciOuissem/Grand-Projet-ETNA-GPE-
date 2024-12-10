'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Process extends Model {
    static associate(models) {
      Process.belongsToMany(models.Input, {
        through: models.ProcessHasInput,
        foreignKey: 'ProcessId',
        onDelete: 'CASCADE'
      });
      Process.belongsToMany(models.User, {
        through: models.UserHasProcess,
        foreignKey: 'ProcessId',
        onDelete: 'CASCADE'
      });
    }
  }
  Process.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    },
    fixed_url: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Process',
    timestamps: true,
    freezeTableName: true
  });
  return Process;
};