'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product, Order}) {
      // define association here
      // this belongs to product with id
      this.belongsTo(Product, {foreignKey : 'productId'})
      // this belongs to order with id
      this.belongsTo(Order, {foreignKey : 'orderId'})

    }
  };
  OrderProduct.init({
    order_product_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    productId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    orderId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    sold_price: {
      type : DataTypes.DOUBLE,
      allowNull : false
    }
  },
  {
    sequelize,
    tableName : 'order_products',
    modelName: 'OrderProduct',
  });
  return OrderProduct;
};