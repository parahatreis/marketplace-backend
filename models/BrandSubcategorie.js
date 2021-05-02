'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrandSubcategorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return {...this.get(), id : undefined};
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
    }
  }, {
    sequelize,
    tableName: 'brand_subcategories',
    modelName: 'BrandSubcategorie',
  });
  return BrandSubcategorie;
};