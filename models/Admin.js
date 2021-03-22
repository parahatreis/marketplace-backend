'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON(){
      return {...this.get(), id : undefined, admin_password : undefined};
    }
  };
  Admin.init({
    admin_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
    },
    admin_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    admin_phone: {
      type : DataTypes.BIGINT,
      allowNull : false
    },
    admin_password: {
      type : DataTypes.STRING,
      allowNull : false
    },
    admin_username: {
      type : DataTypes.STRING,
      allowNull : false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName:'admins',
    modelName: 'Admin',
  });
  return Admin;
};