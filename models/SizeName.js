'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeName extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SizeType}) {
      // define association here
      this.belongsTo(SizeType, {foreignKey : 'sizeTypeId', as : 'sizeType'})
    }
    toJSON(){
      return {
        ...this.get(),
        id : undefined
      }
    }
  };
  SizeName.init({
    size_name_id: {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4
    },
    size_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    sizeTypeId: {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    tableName : 'size_names',
    modelName: 'SizeName',
  });
  return SizeName;
};