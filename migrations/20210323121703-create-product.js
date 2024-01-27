'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      price: {
        type : DataTypes.DOUBLE
      },
      old_price: {
        type : DataTypes.DOUBLE
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
      product_discount: {
        type : DataTypes.INTEGER,
        allowNull : true
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('products');
  }
};