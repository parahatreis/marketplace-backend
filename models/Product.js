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
    static associate({ Brand, SubCategorie, Store, Stock , OrderProduct }) {
      // define association here
      this.belongsTo(SubCategorie, {foreignKey : 'subcategorieId', as : 'subcategorie'});
      this.belongsTo(Brand, {foreignKey : 'brandId', as : 'brand'});
      this.belongsTo(Store, {foreignKey : 'storeId', as : 'store'});
      this.hasMany(Stock, {foreignKey : 'productId', as : 'stocks'})
      // this has many orders
      this.hasMany(OrderProduct, {foreignKey : 'productId'})
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined,
        subcategorieId : undefined,
        brandId : undefined,
        storeId : undefined
      }
    }
  };
  Product.init({
    product_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    product_code: {
      type : DataTypes.STRING,
      allowNull : false
    },
    product_name_tm: {
      type : DataTypes.STRING,
      allowNull : false
    },
    product_name_ru: {
      type : DataTypes.STRING,
      allowNull : false
    },
    product_name_en: {
      type : DataTypes.STRING,
      allowNull : false
    },
    price_tmt: {
      type : DataTypes.DOUBLE
    },
    price_usd : {
      type : DataTypes.DOUBLE
    },
    old_price_tmt: {
      type : DataTypes.DOUBLE
    },
    old_price_usd : {
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
    description_tm: {
      type : DataTypes.TEXT
    },
    description_ru: {
      type : DataTypes.TEXT
    },
    description_en: {
      type : DataTypes.TEXT
    },
    product_images: {
      type : DataTypes.ARRAY(DataTypes.STRING),
    },
    preview_image: {
      type : DataTypes.STRING,
    },
    brandId: {
      type : DataTypes.INTEGER,
      allowNull : true
    },
    subcategorieId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    storeId: {
      type : DataTypes.INTEGER,
      allowNull : true
    }
  },
  {
    // hooks : {
    //   beforeCreate : (product, options) => {
    //    product.product_status = true;
    //    console.log(product.product_status)
    //    console.log(options)
    //   } 
    //  },
    sequelize,
    tableName : 'products',
    modelName: 'Product',
  });
  return Product;
};