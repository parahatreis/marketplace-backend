'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      user_name: {
        type : DataTypes.STRING,
        allowNull : false
      },
      user_phone: {
        type : DataTypes.BIGINT,
        allowNull : false
      },
      user_email: {
        type : DataTypes.STRING,
        allowNull : true
      },
      user_password: {
        type : DataTypes.STRING,
        allowNull : false
      },
      user_address : {
        type : DataTypes.STRING,
        allowNull : true
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
    await queryInterface.dropTable('users');
  }
};