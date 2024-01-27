'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate({ SubCategorie, Product, BrandSubcategorie }) {
      // define association here
      this.belongsToMany(SubCategorie, {
        through: BrandSubcategorie,
        as: 'subcategories',
        foreignKey: 'brandId'
      });
      this.hasMany(Product, { foreignKey: 'brandId', as: 'products' })
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  };
  Brand.init({
    brand_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand_image: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    tableName: 'brands',
    modelName: 'Brand',
    timestamps: true,
    paranoid: true,
  });
  return Brand;
};