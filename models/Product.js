'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Brand,SubCategorie,Store}) {
      // define association here
      this.belongsTo(SubCategorie, {foreignKey : 'subcategorieId', as : 'subcategorie'});
      this.belongsTo(Brand, {foreignKey : 'brandId', as : 'brand'});
      this.belongsTo(Store, {foreignKey : 'storeId', as : 'store'});
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined
      }
    }
  };
  Product.init({
    product_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    product_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    price_tmt: {
      type : DataTypes.DOUBLE
    },
    price_usd : {
      type : DataTypes.DOUBLE
    },
    isPriceUsd : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    product_status: {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    description: {
      type : DataTypes.TEXT
    },
    product_images: {
      type : DataTypes.ARRAY(DataTypes.STRING),
    },
    brandId: {
      type : DataTypes.INTEGER
    },
    subcategorieId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    storeId: {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    tableName : 'products',
    modelName: 'Product',
  });
  return Product;
};