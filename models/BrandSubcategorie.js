'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrandSubcategorie extends Model {
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  };
  BrandSubcategorie.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    brand_subcategories_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subcategorieId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'brand_subcategories',
    modelName: 'BrandSubcategorie',
    timestamps: true,
    paranoid: true,
  });
  return BrandSubcategorie;
};