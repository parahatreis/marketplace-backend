'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    static associate({ Product, Order, SizeName, Store }) {
      // define association here
      // this belongs to product with id
      this.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
      // this belongs to order with id
      this.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
      this.belongsTo(SizeName, { foreignKey: 'sizeNameId', as: 'size_name' })
      this.belongsTo(Store, { foreignKey: 'storeId', as: 'store' })
    }
  };
  OrderProduct.init({
    order_product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    sold_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sizeNameId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
    {
      sequelize,
      tableName: 'order_products',
      modelName: 'OrderProduct',
      timestamps: true,
      paranoid: true,
    });
  return OrderProduct;
};