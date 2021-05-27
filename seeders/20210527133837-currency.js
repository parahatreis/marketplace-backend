'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, DataTypes) => {
     await queryInterface.bulkInsert('currencies', [{
      currency_id : uuidv4(),
      currency_price : 30.50,
      createdAt : DataTypes.fn('now'),
      updatedAt : DataTypes.fn('now')
    }], {});
   
  },

  down: async (queryInterface, DataTypes) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
