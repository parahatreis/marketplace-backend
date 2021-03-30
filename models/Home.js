'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Home extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SubCategorie}) {
      // define association here
      this.belongsTo(SubCategorie, {foreignKey : 'subcategorieId', as : 'subcategorie'})
    }
  };
  Home.init({
    subcategorieId: {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    tableName : 'home-subcategories',
    modelName: 'Home',
  });
  return Home;
};