'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('orders');
  }
};