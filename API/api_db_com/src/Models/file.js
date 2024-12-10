'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsToMany(models.Bucket, {
        through: models.BucketHasFile,
        foreignKey: 'FileId',
        as: 'buckets',
        onDelete: 'CASCADE',
      });
    }
  }
  
  File.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'File',
    timestamps: true,
    freezeTableName: true,
  });

  return File;
};
