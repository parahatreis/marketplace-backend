'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('size_names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      size_name_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      size_name: {
        type : DataTypes.STRING,
        allowNull : false
      },
      sizeTypeId: {
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
    await queryInterface.dropTable('size_names');
  }
};