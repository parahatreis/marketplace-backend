'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Categorie,Brand,Product}) {
      // define association here
      // categorie_id
      this.belongsTo(Categorie, {foreignKey : 'categorieId', as : 'categorie'})
      this.belongsToMany(Brand, {
        through : 'brand_subcategories',
        as : 'brands',
        foreignKey : 'subcategorieId'
      });
      this.hasMany(Product, {foreignKey : 'subcategorieId', as : 'products'})
    }
    toJSON () {
      return {
        ...this.get(),
        id : undefined,
        categorieId : undefined
      }
    }
  };
  SubCategorie.init({
    subcategorie_id:{
      type :  DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    subcategorie_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    subcategorie_image: {
      type : DataTypes.STRING,
    },
    hasColor: {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    categorieId : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    hasSize: {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    sizeType: {
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    tableName : 'subcategories',
    modelName: 'SubCategorie',
  });
  return SubCategorie;
};