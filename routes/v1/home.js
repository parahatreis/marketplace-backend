const express = require('express');
const router = express.Router();
const { Home, SubCategorie, Product, Brand } = require('../../models');


// @route POST v1/home_subcategories
// @desc Create Home Subcategories
// @access Private (Admin)
// TODO AUTH
router.post('/', async (req, res) => {

    const {
        subcategorie_id,
    } = req.body;

    if(!subcategorie_id) return res.status(404).send('Input subcategorie!');

    try {

        const subcategorie = await SubCategorie.findOne({
            where : {subcategorie_id}
        });

        if(!subcategorie) return res.status(404).send('Subcategorie not found!');

        const home_subcategorie = await Home.create({
            subcategorieId : subcategorie.id
        });

        res.send(home_subcategorie);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

// @route GET v1/home_subcategories
// @desc GET Home Subcategorie
// @access Public
router.get('/', async (req, res) => {

   const remove_products = Number(req.query.except_products) === 1 ? true : false;
   let home_subcategories = null;

   
   try {
      if(remove_products){
         home_subcategories = await Home.findAll({
               include : [{
                  model : SubCategorie,
                  as : 'subcategorie',
               }]
         });
      }
      else{
         home_subcategories = await Home.findAll({
               include : [{
                  model : SubCategorie,
                  as : 'subcategorie',
                  include : [
                     {
                        model : Product,
                        as : 'products',
                        limit: 10,
                        where: {
                           product_status: true 
                        },
                        include: {
                           model: Brand,
                           as : 'brand'
                        }
                     },
                  ]
               }]
         });
      }

      return res.json(home_subcategories)
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});


// @route PATCH v1/home_subcategories
// @desc Update Home Subcategories
// @access Private (Admin)
// TODO AUTH
router.patch('/:home_subcategorie_id', async (req, res) => {

    const {
        subcategorie_id,
    } = req.body;

    if(!subcategorie_id) return res.status(404).send('Input subcategorie!');

    try {

        const home_subcategorie = await Home.findOne({where : 
            {
                home_subcategorie_id : req.params.home_subcategorie_id
            }
        });

        if(!home_subcategorie) return res.status(404).send('Home subcategorie not found!');

        const subcategorie = await SubCategorie.findOne({
            where : {subcategorie_id}
        });

        if(!subcategorie) return res.status(404).send('Subcategorie not found!');

        home_subcategorie.subcategorieId = subcategorie.id

        home_subcategorie.save()

        res.send("Updated");

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});



// @route DELETE v1/home_subcategories/:id
// @desc Delete Home Subcategories
// @access Private (Admin)
// TODO AUTH
router.delete('/:home_subcategorie_id', async (req, res) => {
    try {

        const home_subcategorie = await Home.destroy({where : 
            {
            home_subcategorie_id : req.params.home_subcategorie_id
            }
        });

        if(!home_subcategorie) return res.status(404).send('Home subcategorie not found!');

        res.send("Deleted");

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
})

module.exports = router;