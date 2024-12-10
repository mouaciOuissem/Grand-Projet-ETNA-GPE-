'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BucketHasFile extends Model {
    static associate(models) {
      BucketHasFile.belongsTo(models.Bucket, {
        foreignKey: 'BucketId',
        as: 'bucket',
      });
      BucketHasFile.belongsTo(models.File, {
        foreignKey: 'FileId',
        as: 'file',
      });
    }
  }
  
  BucketHasFile.init({
    BucketId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Bucket',
        key: 'id',
      }
    },
    FileId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'File',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'BucketHasFile',
    timestamps: true,
    freezeTableName: true,
  });

  return BucketHasFile;
};
