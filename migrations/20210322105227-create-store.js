'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      store_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      store_name: {
        type : DataTypes.STRING,
        allowNull : true
      },
      store_number: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      store_phone: {
        type : DataTypes.BIGINT,
        allowNull : false
      },
      store_description: {
        type : DataTypes.TEXT,
        allowNull : true
      },
      store_floor: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      store_currency: {
        type : DataTypes.BIGINT,
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
    await queryInterface.dropTable('stores');
  }
};