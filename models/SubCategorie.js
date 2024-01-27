'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubCategorie extends Model {
    static associate({ Categorie, Brand, Product, Home, SizeType, BrandSubcategorie }) {
      // define association here
      // categorie_id
      this.belongsTo(Categorie, { foreignKey: 'categorieId', as: 'categorie' })
      this.belongsToMany(Brand, {
        through: BrandSubcategorie,
        as: 'brands',
        foreignKey: 'subcategorieId'
      });
      this.belongsTo(SizeType, { foreignKey: 'sizeTypeId', as: 'sizeType' });
      // 
      this.hasMany(Product, { foreignKey: 'subcategorieId', as: 'products' });
      this.hasOne(Home, { foreignKey: 'subcategorieId', as: 'home' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        categorieId: undefined
      }
    }
  };
  SubCategorie.init({
    subcategorie_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    subcategorie_name_tm: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategorie_name_ru: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategorie_name_en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategorie_image: {
      type: DataTypes.STRING,
    },
    hasColor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sizeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'subcategories',
    modelName: 'SubCategorie',
    timestamps: true,
    paranoid: true,
  });
  return SubCategorie;
};