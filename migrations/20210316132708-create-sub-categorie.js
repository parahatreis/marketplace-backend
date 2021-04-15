'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('subcategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subcategorie_id:{
        type :  DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
      },
      subcategorie_name_tm: {
        type : DataTypes.STRING,
        allowNull : false
      },
      subcategorie_name_ru: {
        type : DataTypes.STRING,
        allowNull : false
      },
      subcategorie_name_en: {
        type : DataTypes.STRING,
        allowNull : false
      },
      subcategorie_image: {
        type : DataTypes.STRING,
      },
      categorieId : {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      hasColor: {
        type : DataTypes.BOOLEAN,
        defaultValue : false
      },
      sizeTypeId: {
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
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('subcategories');
  }
};