'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      Status.belongsToMany(models.Process, {
        through: models.UserHasProcess,
        foreignKey: 'StatusId',
        onDelete: 'CASCADE' 
      }); 
    }
  }
  Status.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Status',
    timestamps: true,
    freezeTableName: true
  });
  return Status;
};