'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      order_product_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      productId: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      orderId: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      sizeNameId: {
         type: DataTypes.INTEGER,
         allowNull: true
      },
      sold_price: {
        type : DataTypes.DOUBLE,
        allowNull : false
      },
      quantity : {
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
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('order_products');
  }
};