'use strict';
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    const createdAt = moment().format();

    await queryInterface.bulkInsert('currencies', [{
      currency_id: uuidv4(),
      currency_price: 19.50,
      createdAt,
      updatedAt: createdAt,
    }], {});
  },
};
