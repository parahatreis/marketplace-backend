'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Order}) {
      // define association here
      this.hasMany(Order, {foreignKey : 'userId', as : 'orders'})
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined,
        user_password : undefined
      }
    }
  };
  User.init({
    user_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    user_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    user_phone: {
      type : DataTypes.BIGINT,
      allowNull : false
    },
    user_email: {
      type : DataTypes.STRING,
      allowNull : true
    },
    user_password: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    tableName : 'users',
    modelName: 'User',
  });
  return User;
};