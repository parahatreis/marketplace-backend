'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Add seed commands here.
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const generated_password = await bcrypt.hash('smadmin2021', salt);

    // Create Super Admin
    await queryInterface.bulkInsert('admins', [{
      admin_id : DataTypes.UUIDV4,
      admin_name : 'SM Adim',
      admin_phone : 99365577136,
      admin_username : 'smadmin',
      admin_password : generated_password,
      createdAt : DataTypes.fn('now'),
      updatedAt : DataTypes.fn('now')
   }], {
     
   });
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
