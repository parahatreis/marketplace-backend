'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SizeName extends Model {
    static associate({ SizeType, Stock, OrderProduct }) {
      // define association here
      this.belongsTo(SizeType, { foreignKey: 'sizeTypeId', as: 'sizeType' });
      // Has many stock
      this.hasMany(Stock, { foreignKey: 'sizeNameId' });
      this.hasMany(OrderProduct, { foreignKey: 'sizeNameId' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined
      }
    }
  };
  SizeName.init({
    size_name_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    size_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sizeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'size_names',
    modelName: 'SizeName',
    timestamps: true,
    paranoid: true,
  });
  return SizeName;
};