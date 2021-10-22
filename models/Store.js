'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({StoreAdmin,Product}) {
      // define association here
      this.hasMany(StoreAdmin, {foreignKey : 'storeId', as : 'store_admins'});
      this.hasMany(Product, {foreignKey : 'storeId', as : 'products'})
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined
      }
    }
  };
  Store.init({
    store_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    store_name: {
      type : DataTypes.STRING,
      allowNull : true
    },
    store_number: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    store_phone: {
      type : DataTypes.BIGINT,
      allowNull : false
    },
    store_description: {
      type : DataTypes.TEXT,
      allowNull : true
    },
    store_currency: {
      type : DataTypes.BIGINT,
      allowNull : true
    }
  }, {
    sequelize,
    tableName : 'stores',
    modelName: 'Store',
  });
  return Store;
};