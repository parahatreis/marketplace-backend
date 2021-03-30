'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('banners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      banner_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      banner_name: {
        type : DataTypes.STRING,
        allowNull : false
      },
      banner_url: {
        type : DataTypes.STRING,
        allowNull : false
      },
      banner_image: {
        type : DataTypes.STRING
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
    await queryInterface.dropTable('banners');
  }
};