const express = require('express');
const router = express.Router();
const { Home, SubCategorie, Product } = require('../../models');


// @route POST v1/home_subcategories
// @desc Create Home Subcategories
// @access Private (Admin)
router.post('/', async (req, res) => {

    const {
        subcategories,
    } = req.body;

    if(!subcategories || subcategories.length === 0) return res.status(404).send('Input subcategories!');

    try {

        // Delete all home categories
        await Home.destroy({
            where: {},
            truncate: true
          })

        subcategories.forEach(async (sub) => {
            const subcategorie = await SubCategorie.findOne({
                where : {subcategorie_id : sub}
            });
    
            if(!subcategorie) return res.status(404).send('Subcategorie not found!');
    
            const home_subcategorie = await Home.create({
                subcategorieId : subcategorie.id
            });
            homes = [
                ...homes,
                home_subcategorie
            ]
        });

        res.send("Successfully created");

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

// @route GET v1/home_subcategories
// @desc GET Home Subcategorie
// @access Private (Admin)
router.get('/', async (req, res) => {
    try {
        const home_subcategories = await Home.findAll({
            include : [{
                model : SubCategorie,
                as : 'subcategorie',
                include : {
                    model : Product,
                    as : 'products',
                    limit : 10,
                    attributes : ['product_id', 'product_name', 'preview_image','price_tmt']
                }
            }]
        });

        return res.json(home_subcategories)
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

module.exports = router;