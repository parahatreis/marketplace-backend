const express = require('express');
const router = express.Router();
// 
const {Currency ,Product} = require('../../models');
const adminAuth = require("../../middleware/adminAuth");


// @route PATCH v1/currency
// @desc Update Currency
// @access Private (Admin)
router.patch('/', adminAuth, async (req, res) => {

    const newObj = {};

    const {
        currency_id,
        currency_price
    } = req.body;

    if (!currency_price) return res.status(400).send("Input currency_price");

    if (currency_price) newObj.currency_price = currency_price;

    try {

        const currency = await Currency.findOne({where: {currency_id}});

        if (!currency) return res.status(404).send("Currency Not found!");


        // UPDATE ALL PRODUCTS
        const products = await Product.findAll({where : {isPriceUsd : true}});

        async function updateProducts(arr) {
            arr.forEach(async (product) => {

                const price_usd = product.price_usd;
                const old_price_usd = product.old_price_usd;
    
                const new_price = price_usd * currency_price;
                const new_old_price = old_price_usd * currency_price;
    
                await Product.update({
                    price : new_price,
                    old_price : new_old_price,
                },{
                    where : {product_id : product.product_id}
                });
            })
        } 

        updateProducts(products).then(async (result) => {
            await Currency.update(newObj,{
                where: {currency_id}
            });
            res.json('Updated!');
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Server error')
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

// @route GET v1/stores
// @desc Get all Currency
// @access Private
router.get('/', adminAuth, async (req, res) => {
    try {
       const currencies = await Currency.findAll();

       res.json(currencies[0]);
    }
    catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});


module.exports = router;