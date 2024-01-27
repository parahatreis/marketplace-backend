'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate({ User, OrderProduct }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
      // this model has many order_poroducts
      this.hasMany(OrderProduct, { foreignKey: 'orderId', as: 'order_products' })
    }
  };
  Order.init({
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    // TODO
    //  1 = Garashylyar, 2 = Tayyarlanylyar , 3 = Gowsuryldy, 0 = Goybolsun edildi
    order_status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userAuth: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_phone: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    user_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    // TODO
    // 0 - Cash, 1 - Cart, 2 - Online
    payment_type: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
    timestamps: true,
    paranoid: true,
  });
  return Order;
};