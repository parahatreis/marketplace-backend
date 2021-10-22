const express = require('express');
const router = express.Router();
// 
const {Store,StoreAdmin ,Product} = require('../../models');
const adminAuth = require("../../middleware/adminAuth");


// @route POST v1/stores
// @desc Create Store
// @access Private (Admin)
router.post('/', adminAuth, async (req, res) => {

   const newObj = {};

   const {
      store_name,
      store_number,
      store_phone,
      store_currency,
      store_description,
      store_floor
   } = req.body;

   if (!store_number) return res.status(400).send("Input store_number");
   if (!store_phone) return res.status(400).send("Input store_phone");

   if (store_name) newObj.store_name = store_name;
   if (store_number) newObj.store_number = Number(store_number);
   if (store_phone) newObj.store_phone = Number(store_phone);
   if (store_currency) newObj.store_currency = Number(store_currency);
   if (store_floor) newObj.store_floor = Number(store_floor);
   if (store_description) newObj.store_description = store_description;

   try {

      const store = await Store.create(newObj);

      res.json(store);

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});

// @route GET api/stores
// @desc Get all Stores
// @access Public
router.get('/', adminAuth, async (req, res) => {
    try {
       const stores = await Store.findAll({
          include: [
            {
               model: StoreAdmin,
               as: 'store_admins',
               attributes: ['store_admin_id', 'store_admin_name']
            },
            {
               model : Product,
               as : 'products',
               attributes : ['product_id']
            }
         ]
       });
       res.json(stores);
    }
    catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});

// @route GET api/stores/:store_id
// @desc Get Store By id
// @access Public
router.get('/:store_id', adminAuth, async (req, res) => {
    try {
        const store = await Store.findOne({
            where : {
                store_id : req.params.store_id
            }
        });

        if(!store) return res.status(404).send('Store Not found !')

        res.json(store);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route PATCH api/stores/:store_id
// @desc Update Store
// @access Private (only Admin)
router.patch('/:store_id', adminAuth, async (req, res) => {

   const newObj = {};

   const {
      store_name,
      store_number,
      store_phone,
      store_currency,
      store_description,
      store_floor
   } = req.body;

   if (!store_number) return res.status(400).send("Input store_number");
   if (!store_phone) return res.status(400).send("Input store_phone");
   if (!store_floor) return res.status(400).send("Input store_floor");

   if (store_name) newObj.store_name = store_name;
   if (store_number) newObj.store_number = Number(store_number);
   if (store_phone) newObj.store_phone = Number(store_phone);
   if (store_currency) newObj.store_currency = Number(store_currency);
   if (store_floor) newObj.store_floor = Number(store_floor);
   if (store_description) newObj.store_description = store_description;

   try {
      const store = await Store.update(newObj, {
         where: {
            store_id: req.params.store_id
         }
      });

      if (!store) {
         return res.status(404).send('Store not found');
      }

      res.json(store);

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});

// @route DELETE api/stores/:store_id
// @desc Delete Store
// @access Private (only Admin)
router.delete('/:store_id', adminAuth, async (req, res) => {
    try {
       const store = await Store.destroy({
          where: {
             store_id: req.params.store_id
          }
       });
 
       if (!store) {
          return res.status(404).send('Store not found');
       }
 
       res.json(store);
    } catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});





// ** Change currency of store and update all products
// @route PATCH api/stores/change_currency
// @desc Get all Stores
// @access Private (both)  ((((NOW IT IS ONLY FOR StoreAdmin))))
// TODO
// router.patch('/change/currency', async (req, res) => {

//    let new_currency = req.body.store_currency;

//    try {

//       const store = await Store.findOne({where: { store_id: req.user.store_id }});
//       if(!store) return res.status(404).send('Store not found')

//       const products = await Product.findAll({
//          where: { store_id: req.user.store_id },
//          attributes: ['price_usd', 'product_id']
//       });


//       products.forEach(async (product) => {

//          const findProduct = await Product.findOne({where : {product_id : product.product_id}})

//          findProduct.price_tmt  =  Number(product.price_usd) * Number(new_currency);

//          await findProduct.save()

//       })

//       res.send('Updated')

//    }
//    catch (error) {
//       console.log(error);
//       res.status(500).send('Server error')
//    }
// });
 


module.exports = router;