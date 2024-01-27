'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categorie extends Model {
    static associate({ SubCategorie }) {
      // define association here
      this.hasMany(SubCategorie, { foreignKey: 'categorieId', as: 'subcategories' })
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  };
  Categorie.init({
    categorie_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    categorie_name_tm: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categorie_name_ru: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categorie_name_en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categorie_image: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Categorie',
    timestamps: true,
    paranoid: true,
  });
  return Categorie;
};