'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bucket extends Model {
    static associate(models) {
      Bucket.belongsToMany(models.File, {
        through: models.BucketHasFile,
        foreignKey: 'BucketId',
        as: 'files',
        onDelete: 'CASCADE',
      });
      Bucket.belongsTo(models.UserDetails, {
        foreignKey: 'UserdetailsId',
        as: 'bucket',
        onDelete: 'CASCADE',
      });
    }
  }
  
  Bucket.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UserdetailsId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    bucketName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Bucket',
    timestamps: true,
    freezeTableName: true,
  });

  return Bucket;
};
