'use strict';
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const generated_password = await bcrypt.hash('reis2000', salt);
    const createdAt = moment().format();

    // Create Super Admin
    await queryInterface.bulkInsert('admins', [{
      admin_id: uuidv4(),
      admin_name: 'Super Admin',
      admin_phone: 99362333271,
      admin_username: 'admin',
      admin_password: generated_password,
      createdAt,
      updatedAt: createdAt,
    }], {
    });
  },
};
