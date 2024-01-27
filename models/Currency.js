'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate(models) {
      // define association here
    }
  };
  Currency.init({
    currency_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    currency_price: {
      type: DataTypes.DOUBLE
    }
  }, {
    sequelize,
    tableName: 'currencies',
    modelName: 'Currency',
    timestamps: true,
    paranoid: true,
  });
  return Currency;
};