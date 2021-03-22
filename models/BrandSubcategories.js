'use strict';
const {
  Model
} = require('sequelize');

// const { Brand, Subcategories } = require('./index');

module.exports = (sequelize, DataTypes) => {
  class BrandSubcategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BrandSubcategories.init({
    brandId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    subcategorieId: {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    tableName: 'brand_subcategories',
    modelName: 'BrandSubcategories',
  });
  return BrandSubcategories;
};