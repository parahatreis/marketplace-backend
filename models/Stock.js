'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate({ Product, SizeType, SizeName }) {
      // define association here
      this.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      // Stock can has Size Type
      this.belongsTo(SizeType, { foreignKey: 'sizeTypeId', as: 'sizeType' });
      // Stock can has Size Name
      this.belongsTo(SizeName, { foreignKey: 'sizeNameId', as: 'sizeName' });
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined
      }
    }
  };
  Stock.init({
    stock_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sizeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sizeNameId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stocks',
    modelName: 'Stock',
    timestamps: true,
    paranoid: true,
  });
  return Stock;
};