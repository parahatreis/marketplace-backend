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
      preview_image: {
        type : DataTypes.STRING,
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('products');
  }
};