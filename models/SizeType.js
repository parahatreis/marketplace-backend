'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SubCategorie, SizeName, Stock}) {
      // define association here
      this.belongsTo(SubCategorie, {foreignKey : 'subcategorieId', as : 'subcategorie'});
      this.hasMany(SizeName, {foreignKey : 'sizeTypeId', as : 'size_names'});
      // Has many stock
      this.hasMany(Stock, {foreignKey : 'sizeTypeId'});
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined
      }
    }
  };
  SizeType.init({
    size_type_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    size_type: {
      type : DataTypes.STRING,
      allowNull : false
    },
    subcategorieId: {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    tableName : 'size_types',
    modelName: 'SizeType',
  });
  return SizeType;
};