'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    toJSON() {
      return {
        ...this.get(),
        id: undefined
      }
    }
  };
  Banner.init({
    banner_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    banner_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banner_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banner_image: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    tableName: 'banners',
    modelName: 'Banner',
    timestamps: true,
    paranoid: true,
  });
  return Banner;
};