const express = require('express');
const router = express.Router();
// 
const {Currency ,Product} = require('../../models');


// @route PATCH v1/currency
// @desc Update Currency
// @access Private (Admin)
// TODO AUTH
router.patch('/', async (req, res) => {

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


        await Currency.update(newObj,{
            where: {currency_id}
        });

        res.json(currency);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

// @route GET v1/stores
// @desc Get all Currency
// @access Private
// TODO AUTH
router.get('/', async (req, res) => {
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