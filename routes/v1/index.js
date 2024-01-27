// routes/index.js
const express = require('express');
const router = express.Router();

router.get('', (_, res) => res.send('Marketplace API V1 is Running Successfully!'))
// All routes
router.use('/categories', require('./categories'))
router.use('/subcategories', require('./subcategories'))
router.use('/brands', require('./brands'))
router.use('/admins', require('./admins'))
router.use('/stores', require('./stores'))
router.use('/store_admins', require('./store_admins'))
router.use('/products', require('./products'))
router.use('/banners', require('./banners'))
router.use('/home_subcategories', require('./home'))
router.use('/users', require('./users'))
router.use('/orders', require('./orders'))
router.use('/currency', require('./currency'))
router.use('/size_types', require('./size_types'))
router.use('/contacts', require('./contacts'))

module.exports = router;