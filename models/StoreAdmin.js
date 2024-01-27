'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StoreAdmin extends Model {
    static associate({ Store }) {
      // define association here
      this.belongsTo(Store, { foreignKey: 'storeId', as: 'store' })
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        store_admin_password: undefined
      }
    }
  };
  StoreAdmin.init({
    store_admin_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    store_admin_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    store_admin_phone: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    store_admin_password: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    store_admin_username: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'store_admins',
    modelName: 'StoreAdmin',
    timestamps: true,
    paranoid: true,
  });
  return StoreAdmin;
};