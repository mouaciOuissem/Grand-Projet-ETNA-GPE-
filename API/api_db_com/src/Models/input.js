'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Input extends Model {
    static associate(models) {
      Input.belongsToMany(models.Process, {
        through: models.ProcessHasInput,
        foreignKey: 'InputId',
        onDelete: 'CASCADE' 
      }); 
    }
  }
  Input.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target: {
      type: DataTypes.STRING,
      allowNull: false
    },
    css_target_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Input',
    timestamps: true,
    freezeTableName: true
  });
  return Input;
};