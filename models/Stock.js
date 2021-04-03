'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Product}) {
      // define association here
      this.belongsTo(Product, {foreignKey : 'productId', as : 'product'})
    }
    toJSON() {
      return {
        ...this.get(),
        id : undefined
      }
    }
  };
  Stock.init({
    stock_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    productId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    stock_quantity: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    stock_type: {
      type : DataTypes.STRING,
      allowNull : true
    },
    stock_size: {
      type : DataTypes.STRING,
      allowNull : true
    }
  }, {
    sequelize,
    tableName : 'stocks',
    modelName: 'Stock',
  });
  return Stock;
};