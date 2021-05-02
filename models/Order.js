'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, OrderProduct }) {
      // define association here
      this.belongsTo(User, {foreignKey : 'userId', as : 'user'})
      // this model has many order_poroducts
      this.hasMany(OrderProduct, {foreignKey : 'orderId', as : 'order_products'})
    }
  };
  Order.init({
    order_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    order_status: {
      type : DataTypes.STRING,
      defaultValue : 'waiting'
    },
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    subtotal : {
      type : DataTypes.DOUBLE,
      allowNull : true
    },
    address : {
      type : DataTypes.STRING,
      allowNull : false    
    },
    payment_type : {
      type : DataTypes.STRING,
      defaultValue : 'cash'    
    }
  }, {
    sequelize,
    tableName : 'orders',
    modelName: 'Order',
  });
  return Order;
};