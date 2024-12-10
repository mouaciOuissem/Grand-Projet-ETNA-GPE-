'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetails extends Model {
    static associate(models) {
      UserDetails.hasOne(models.UserFiscalDetails, {
        foreignKey: 'UserdetailsId',
        as: 'userFiscalDetails',
        onDelete: 'CASCADE',
      });

      UserDetails.hasOne(models.SocialCategorie, {
        foreignKey: 'UserdetailsId',
        as: 'socialCategorie',
        onDelete: 'CASCADE',
      });

      UserDetails.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'userDetails',
        onDelete: 'CASCADE',
      });
      
      UserDetails.hasOne(models.Bucket, {
        foreignKey: 'UserdetailsId',
        as: 'bucket',
        onDelete: 'CASCADE',
      });
    }
  }
  UserDetails.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pronouns: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_connection: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'française'
    },
    res_card_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    separated: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    separated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UserDetails',
    timestamps: true,
    freezeTableName: true
  });
  return UserDetails;
};