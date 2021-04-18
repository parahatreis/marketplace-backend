'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('store_admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      store_admin_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      store_admin_name: {
        type : DataTypes.STRING,
        allowNull : false
      },
      store_admin_phone: {
        type : DataTypes.BIGINT,
        allowNull : false
      },
      store_admin_password: {
        type : DataTypes.STRING,
        defaultValue : false
      },
      store_admin_username: {
        type : DataTypes.STRING,
        defaultValue : false
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
    await queryInterface.dropTable('store_admins');
  }
};