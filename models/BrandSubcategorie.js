'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrandSubcategorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BrandSubcategorie.init({
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
    tableName : 'brand_subcategorie',
    modelName: 'BrandSubcategorie',
  });
  return BrandSubcategorie;
};