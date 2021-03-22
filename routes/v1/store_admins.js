const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
// Models
const {StoreAdmin,Store} = require('../../models');

// @route POST v1/store_admins
// @desc Register StoreAdmin
// @access Private(Admin)
router.post('/', async (req, res) => {
   let newObj = {}

    const {
        store_admin_name,
        store_admin_phone,
        store_admin_password,
        store_admin_username,
        storeId,
    } = req.body;

    if(store_admin_name) newObj.store_admin_name = store_admin_name;
    if(store_admin_phone) newObj.store_admin_phone = Number(store_admin_phone);
    if(store_admin_password) newObj.store_admin_password = store_admin_password;
    if(store_admin_username) newObj.store_admin_username = store_admin_username;

    if(!storeId) return res.status(400).send('Select store !');

    try {

        // find store
        const store = await Store.findOne({where:{ store_id : storeId }});

        console.log(store)

        if(!store) return res.status(404).send('Store not found')

        newObj.storeId = store.id
        
        const storeAdmin = await StoreAdmin.create(newObj);

        return res.send(storeAdmin);

    }
    catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});


module.exports = router;