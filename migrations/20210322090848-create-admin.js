'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      admin_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
      },
      admin_name: {
        type : DataTypes.STRING,
        allowNull : false
      },
      admin_phone: {
        type : DataTypes.BIGINT,
        allowNull : false
      },
      admin_password: {
        type : DataTypes.STRING,
        allowNull : false
      },
      admin_username: {
        type : DataTypes.STRING,
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
    await queryInterface.dropTable('admins');
  }
};