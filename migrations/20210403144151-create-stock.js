'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      stock_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      productId: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      stock_quantity: {
        type : DataTypes.INTEGER,
        defaultValue : 0
      },
      sizeTypeId: {
        type : DataTypes.INTEGER,
        allowNull : true
      },
      sizeNameId: {
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
    await queryInterface.dropTable('stocks');
  }
};