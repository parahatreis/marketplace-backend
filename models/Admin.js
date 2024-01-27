'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        admin_password: undefined
      };
    }
  };
  Admin.init({
    admin_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    admin_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_phone: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    admin_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_username: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'admins',
    modelName: 'Admin',
    timestamps: true,
    paranoid: true,
  });
  return Admin;
};