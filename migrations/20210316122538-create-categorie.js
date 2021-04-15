'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categorie_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
      },
      categorie_name_tm: {
        type : DataTypes.STRING,
        allowNull: false
      },
      categorie_name_ru: {
        type : DataTypes.STRING,
        allowNull: false
      },
      categorie_name_en: {
        type : DataTypes.STRING,
        allowNull: false
      },
      categorie_image:{
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
    await queryInterface.dropTable('categories');
  }
};