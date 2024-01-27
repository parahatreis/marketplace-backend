'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, DataTypes) => {
     await queryInterface.bulkInsert('currencies', [{
      currency_id : uuidv4(),
      currency_price : 19.50,
    }], {});
  },
};
