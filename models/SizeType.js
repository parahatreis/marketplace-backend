'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SizeType extends Model {
    static associate({ SubCategorie, SizeName, Stock }) {
      // define association here
      this.hasMany(SubCategorie, { foreignKey: 'sizeTypeId', as: 'subcategories' });
      this.hasMany(SizeName, { foreignKey: 'sizeTypeId', as: 'size_names' });
      // Has many stock
      this.hasMany(Stock, { foreignKey: 'sizeTypeId' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined
      }
    }
  };
  SizeType.init({
    size_type_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    size_type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'size_types',
    modelName: 'SizeType',
    timestamps: true,
    paranoid: true,
  });
  return SizeType;
};