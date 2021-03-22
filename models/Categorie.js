'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SubCategorie}) {
      // define association here
      this.hasMany(SubCategorie, {foreignKey : 'categorieId', as : 'subcategories'})
    }
    toJSON() {
      return {...this.get(), id : undefined};
    }
  };
  Categorie.init({
    categorie_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
    },
    categorie_name: {
      type : DataTypes.STRING,
      allowNull: false
    },
    categorie_image:{
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    tableName : 'categories',
    modelName: 'Categorie',
  });
  return Categorie;
};