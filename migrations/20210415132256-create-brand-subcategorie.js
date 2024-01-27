'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('brand_subcategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      brand_subcategories_id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
       },
      brandId: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      subcategorieId: {
         type: DataTypes.INTEGER,
         allowNull: false
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
    await queryInterface.dropTable('brand_subcategories');
  }
};