'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SubCategorie,Product}) {
      // define association here
      // this.hasMany(SubCategorie, {foreignKey : 'subcategories' });
      this.belongsToMany(SubCategorie, {
        through : 'brand_subcategories',
        as : 'subcategories',
        foreignKey : 'brandId'
      });
      this.hasMany(Product, {foreignKey : 'brandId', as : 'products'})
    }
    toJSON() {
      return {...this.get(), id : undefined};
    }
  };
  Brand.init({
    brand_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
    },
    brand_name: {
      type : DataTypes.STRING,
      allowNull: false
    },
    brand_image: {
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    tableName : 'brands',
    modelName: 'Brand',
  });
  return Brand;
};