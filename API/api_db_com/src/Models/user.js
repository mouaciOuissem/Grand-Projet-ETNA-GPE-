'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserDetails, {
        foreignKey: 'UserId',
        as: 'userDetails',
        onDelete: 'CASCADE',
      });

      User.belongsToMany(models.Process, {
        through: models.UserHasProcess,
        foreignKey: 'UserId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encryption_password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    email_verif: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    freezeTableName: true
  });
  return User;
};