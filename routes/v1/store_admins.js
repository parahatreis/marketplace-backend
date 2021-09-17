const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const router = express.Router();
// Models
const {StoreAdmin,Store} = require('../../models');
const storeAdminAuth = require('../../middleware/storeAdminAuth')


// @route POST v1/store_admins
// @desc Register StoreAdmin
// @access Private(Admin)
// TODO SUPERADMIN
router.post('/', async (req, res) => {

    const {
        store_admin_name,
        store_admin_phone,
        store_admin_password,
        store_admin_username,
        storeId
    } = req.body;

    if(!store_admin_name) return res.status(400).send('Input store admin name!');
    if(!store_admin_phone) return res.status(400).send('Input store_admin_phone!');
    if(!store_admin_password) return res.status(400).send('Input store_admin_password!');
    if(!store_admin_username) return res.status(400).send('Input store_admin_username!');
    if(!storeId) return res.status(400).send('Select store !');

    try {

        // Check user is exists
        const admin = await StoreAdmin.findOne({where : {store_admin_username}});

        if (admin) {
            return res.status(400).json({
                errors: [{
                msg: 'Admin already exists'
                }]
            });
        }

        // find store
        const store = await Store.findOne({where:{ store_id : storeId }});
        if(!store) return res.status(404).send('Store not found')

        let newStoreId = store.id

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const generated_password = await bcrypt.hash(store_admin_password, salt);

        
        const storeAdmin = await StoreAdmin.create({
            store_admin_name,
            store_admin_password : generated_password,
            store_admin_username,
            store_admin_phone : Number(store_admin_phone),
            storeId : newStoreId
        });

        // jwt
       const payload = {
            store_admin: {
                id: storeAdmin.store_admin_id,
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '21600s' }, (err, token) => {
            if (err) throw err;
            return res.json({ token, storeAdmin }); 
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});


// @route POST api/store_admins/login
// @desc Login StoreAdmin
// @access Public
// TODO PUBLIC
router.post('/login', async (req, res) => {
    
    const { store_admin_username, store_admin_password } = req.body;
    
    try {
       // Check user exists
       let store_admin = await StoreAdmin.findOne({where : {store_admin_username}});
       if (!store_admin) {
          return res.status(400).json({errors: "Admin not found" });
       }
       
    //    Check password
       const isMatch = await bcrypt.compare(store_admin_password, store_admin.store_admin_password);
       if (!isMatch) {
          return res.status(400).json({
            errors: "Password fail"
          });
       }
 
 
       let str_id = null;
       if (store_admin.store_id) str_id = store_admin.store_id;
 
       // jwt
       const payload = {
          store_admin: {
             id: store_admin.store_admin_id,
          }
       };
 
       jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '21600s' }, (err, token) => {
          if (err) throw err;
          return res.json({ token }); 
       })
    }
    catch (error) {
       console.error(error.message);
       res.status(500).send('Server error')
    }
});
 

// @route GET v1/store_admins/auth
// @desc Get auth store_admin
// @access Private(store_admin)
// TODO ADMIN
router.get('/auth', storeAdminAuth , async (req, res) => {
    try {
        const admin = await StoreAdmin.findOne({
            where: {
                store_admin_id: req.store_admin.id
            },
            include : {
                model : Store,
                as : 'store',
                attributes : ['store_id','store_name']
            }
        });

        if(!admin) return res.status(404).send('Admin not found')

        res.json(admin)

    } catch (error) {
        console.log(error);
        res.status(400).send('Server error')
    }
});


// TODO SUPERADMIN
// @route GET api/store_admins
// @desc Get store_admins
// @access Public
router.get('/', async (req, res) => {

    try {
        const store_admins = await StoreAdmin.findAll({
            include : [
                {
                    model : Store,
                    as : 'store',   
                    attributes : ['store_id','store_name'],
                }
            ]
        });
 
        res.json(store_admins)
 
    } catch (error) {
       console.log(error);
       res.status(400).send('Server error')
    }
});
 


// @route GET api/store_admins/:store_admin_id
// @desc Get store_admin by id
// @access Public
// TODO SUPERADMIN
router.get('/:store_admin_id', async (req, res) => {
    try {
        const store_admin = await StoreAdmin.findOne({
            where : {
                store_admin_id : req.params.store_admin_id
            },
            include : {
                model : Store,
                as : 'store',
                attributes : ['store_id','store_name']
            }
        });


        if(!store_admin) return res.status(404).send('Store Admin Not found')

        res.json(store_admin)

    } catch (error) {
        console.log(error);
        res.status(400).send('Server error')
    }
});


// @route DELETE api/store_admins/:store_admin_id
// @desc DELETE store_admin by id
// @access Private
// TODO SUPERADMIN
router.delete('/:store_admin_id', async (req, res) => {
    try {
        const store_admin = await StoreAdmin.destroy({
            where : {
                store_admin_id : req.params.store_admin_id
            }
        });


        if(!store_admin) return res.status(404).send('Store Admin Not found')

        res.json(store_admin)

    } catch (error) {
        console.log(error);
        res.status(400).send('Server error')
    }
});
 

// @route UPDATE api/store_admins/:store_admin_id
// @desc UPDATE store_admin by id
// @access Public
// TODO SUPERADMIN
router.patch('/:store_admin_id', async (req, res) => {

    const newObj = {};
 
    const {
       store_admin_name,
       store_admin_phone,
       store_admin_password,
       store_admin_username,
       storeId,
   } = req.body;

    if(!store_admin_name) return res.status(400).send('Input store admin name!');
    if(!store_admin_phone) return res.status(400).send('Input store_admin_phone!');
    if(!store_admin_username) return res.status(400).send('Input store_admin_username!');
    if(!storeId) return res.status(400).send('Select store !');


    if(store_admin_name) newObj.store_admin_name = store_admin_name;
    if(store_admin_phone) newObj.store_admin_phone = Number(store_admin_phone);
    if(store_admin_username) newObj.store_admin_username = store_admin_username;
 
    try {
        // find store
        const store = await Store.findOne({where:{ store_id : storeId }});
        if(!store) return res.status(404).send('Store not found');
        newObj.storeId = store.id;

       if (store_admin_password) {
           // Encrypt password
           const salt = await bcrypt.genSalt(10);
           const generated_password = await bcrypt.hash(store_admin_password, salt);
           newObj.store_admin_password = generated_password
        }

        const storeAdmin = await StoreAdmin.update(newObj,{
            where : {
                store_admin_id : req.params.store_admin_id
            }
        });
 
        res.send(storeAdmin);
 
    }
    catch (error) {
       console.log(error)
       res.status(500).send('Server error')
    }
});
 
// @route UPDATE api/store_admins/change_password
// @desc UPDATE store_admin password
// @access Private
// TODO ADMIN
router.patch('/password/change', storeAdminAuth, async (req, res) => {

    const newObj = {};

    const {
        new_store_admin_password,
        old_store_admin_password,
    } = req.body;

    if (!new_store_admin_password) return res.status(400).send('Input new_store_admin_password!');
    if (!old_store_admin_password) return res.status(400).send('Input old_store_admin_password!');

    try {
        const admin = await StoreAdmin.findOne({
            where: {
                store_admin_id: req.store_admin.id
            }
        });

        if (!admin) return res.status(404).send('Admin not found');
        //    Check password
        const isMatch = await bcrypt.compare(old_store_admin_password, admin.store_admin_password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid password!'
                }]
            });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const generated_password = await bcrypt.hash(new_store_admin_password, salt);
        newObj.store_admin_password = generated_password

        await StoreAdmin.update(newObj, {
            where: {
                store_admin_id: req.store_admin.id
            }
        });

        res.json({
            msg : 'Successfully updated!'
        });

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
});
 



module.exports = router;