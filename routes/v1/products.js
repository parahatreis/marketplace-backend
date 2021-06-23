const express = require('express');
const router = express.Router();
const { Product, Store, Brand,SubCategorie, Stock, SizeName, SizeType, Currency} = require('../../models');
const {Op} = require('sequelize')
// File Upload Multer
const multer = require('multer');
// // Sharp to image converter
const sharp = require('sharp');
const fs = require('fs');
const config = require('config');



// TODO AUTH
// @route POST v1/products
// @desc Create Product
// @access Private(admin)
router.post('/', async (req, res) => {

    let newObj = {};

    const {
        product_code,
        product_name_tm,
        product_name_en,
        product_name_ru,
        description_tm,
        description_ru,
        description_en,
        price_tmt,
        price_usd,
        old_price_tmt,
        old_price_usd,
        subcategorie_id,
        brand_id,
        store_id,
        stocks
    } = req.body;

    // Validate
    if(!product_code) return res.status(400).send('Input Product Code');
    if(!product_name_tm) return res.status(400).send('Input Product Name');
    if(!product_name_en) return res.status(400).send('Input Product Name');
    if(!product_name_ru) return res.status(400).send('Input Product Name');
    if(!price_tmt && !price_usd) return res.status(400).send('Input Product Price');
    if(!subcategorie_id) return res.status(400).send('Input Subcategorie');


    if(product_code) newObj.product_code = product_code;
    if(product_name_tm) newObj.product_name_tm = product_name_tm;
    if(product_name_en) newObj.product_name_en = product_name_en;
    if(product_name_ru) newObj.product_name_ru = product_name_ru;
    if(description_tm) newObj.description_tm = description_tm;
    if(description_ru) newObj.description_ru = description_ru;
    if(description_en) newObj.description_en = description_en;
    if(price_tmt) newObj.price_tmt = price_tmt;
    if(price_usd) newObj.price_usd = price_usd;
    if (old_price_tmt) newObj.old_price_tmt = old_price_tmt;
    if (old_price_usd) newObj.old_price_usd = old_price_usd;
    if(price_usd) newObj.isPriceUsd = true;

    try {

        // Subcategorie
        const subcategorie = await SubCategorie.findOne({where : {subcategorie_id} });
        if(!subcategorie) return res.status(404).send('Subcategorie not found!');
        newObj.subcategorieId = subcategorie.id;

        // Brand
        if(brand_id){
            const brand = await Brand.findOne({where : {brand_id} });
            if(!brand) return res.status(404).send('Brand not found!'); 
            newObj.brandId = brand.id;
        }
        else{
            newObj.brandId = null
        }
        
        // Store 
        if(store_id){
            const store = await Store.findOne({where : {store_id} });
            if(!store) return res.status(404).send('Store not found!');
            newObj.storeId = store.id;
        }
        // Price settings
        if(price_usd){
            const currencies = await Currency.findAll();
            const currency = currencies[currencies.length - 1];
            newObj.price = currency.currency_price * price_usd;
            if(old_price_usd){
                newObj.old_price = currency.currency_price * old_price_usd;
            }
        }
        if(price_tmt){
            newObj.price = price_tmt;
            if(old_price_tmt){
                newObj.old_price = old_price_tmt;
            }
        }

        const calculateDiscount = (val,old_val) => {
            return Math.floor(100 - (val * 100 / old_val))
        }
        if(newObj.old_price){
            const discount = calculateDiscount(newObj.price,newObj.old_price);
            newObj.product_discount = discount;
        }

        // Create Product
        const product = await Product.create(newObj);

        // Create Product Stocks
        if(stocks){
            if(stocks.length > 0){
                stocks.forEach(async (stock) => {

                    let sizeType = null;
                    let sizeName = null;

                    if(stock.size_type_id){
                        // Find Size Type
                        sizeType = await SizeType.findOne({where:{size_type_id : stock.size_type_id}});
                        if(!sizeType)  return res.status(404).send('Size Type not found!');
                    }

                    if(stock.size_name_id){
                        // Find Size Name
                        sizeName = await SizeName.findOne({where:{size_name_id : stock.size_name_id}});
                        if(!sizeName) return res.status(404).send("Size Name Not found")
                    }

                    await Stock.create({
                        stock_quantity : stock.stock_quantity,
                        sizeTypeId : sizeType ? sizeType.id : null,
                        sizeNameId : sizeName ? sizeName.id : null,
                        productId : product.id
                    });
                })
            }
        }

        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route GET v1/products
// @desc Get all products
// @access Public(for admin)
router.get('/', async (req,res) => {

    let order = [];
    let page = 0;
    let limit = 10;

    // Sorting
   if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        order.push(parts);
    }
    // limit
    if (req.query.limit) {
        limit = Number(req.query.limit)
    }
    // page
    if (req.query.page) {
        page = Number(req.query.page)
    }

    try {
        const products = await Product.findAll({
            order,
            limit,
            offset: page,
            include : [
                {
                    model : SubCategorie,
                    as : 'subcategorie',
                    attributes : ['subcategorie_id', 'subcategorie_name_tm', 'subcategorie_name_ru', 'subcategorie_name_en']
                },
                {
                    model : Brand,
                    as : 'brand',
                    attributes : ['brand_id', 'brand_name']
                },
                {
                    model : Store,
                    as : 'store',
                    attributes : ['store_id', 'store_name']
                },
                {
                   model: Stock,
                   as: 'stocks',
                   include: {
                      model: SizeName,
                      as : 'sizeName'
                   }
                }
            ]
        });
        return res.json({
            rows : products,
            count :  products.length + page,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route POST v1/products/subcategorie/:subcategorie_id
// @desc Get all products by subcategorie
/* @sortBy: 
        createdAt    /products?sortBy=createdAt:desc || asc
        price_tmt    /products?sortBy=price_tmt:desc || asc
*/
/* @filter : 
      price_range: /products?priceRange=20:100
      brand:   /products?brand=brand_id
      size: /products?size=M                         
      TODO color: /products?color=blue                    
*/
/* @limit&pagination : /products?limit=10&page=2 */

// @access Public
router.get('/subcategorie/:subcategorie_id', async (req,res) => {


    let order = [];
    let range = [0, Number.POSITIVE_INFINITY];
    let page = 0;
    let limit = 10;
    let brandId = null;
    let sizeNameId = null;
    let subcategorieId = null;
    // 
    let products = [];

    // Sorting
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        order.push(parts);
    }
    // Filter By Price Range
    if (req.query.priceRange) {
        let rangeBetween = req.query.priceRange.split(':');
        rangeBetween.forEach((val,index) => rangeBetween[index] = Number(val));
        range = rangeBetween;
    }
    // limit
    if (req.query.limit) {
        limit = Number(req.query.limit)
    }
    // page
    if (req.query.page) {
        page = Number(req.query.page)
    }

    try {

        // page
        if (req.query.size) {
            let size = req.query.size;
            const findSize = await SizeName.findOne({where : {size_name_id : size }});
            sizeNameId = findSize.id
        }

        // if brand
        if(req.query.brand){
            const findBrand = await Brand.findOne({where : {brand_id : req.query.brand}});
            brandId = findBrand.id
        }

        // if brand
        if(req.params.subcategorie_id){
            const findSubcategorie = await SubCategorie.findOne({where : {subcategorie_id : req.params.subcategorie_id}});
            subcategorieId = findSubcategorie.id
        }


        if(brandId && sizeNameId){
            products = await Product.findAndCountAll({
                order,
                distinct : true,
                limit,
                offset: page,
                where : {
                    [Op.and] : [
                        {
                            subcategorieId
                        },
                        {
                            brandId
                        },
                        {
                            price : {
                                [Op.between] : range
                            }
                        },
                        {
                            product_status : true
                        }
                    ]
                },
                include : [
                    {
                        model : Brand,
                        as : 'brand'
                    },
                    {
                        model : Stock,
                        as : 'stocks',
                        where : {
                            sizeNameId          
                        },
                        include : [
                            {
                                model : SizeName,
                                as : 'sizeName',
                            },
                            {
                                model: SizeType,
                                as: 'sizeType',
                            }
                        ]
                    }
                ]
            });
        }
        else if(brandId){
            products = await Product.findAndCountAll({
                order,
                distinct : true,
                limit,
                offset: page,
                where : {
                    [Op.and] : [
                        {
                            subcategorieId
                        },
                        {
                            brandId
                        },
                        {
                            price : {
                                [Op.between] : range
                            }
                        },
                        {
                            product_status : true
                        }
                    ]
                },
                include : [
                    {
                        model : Brand,
                        as : 'brand'
                    },
                    {
                        model : Stock,
                        as : 'stocks',
                        include : [
                            {
                                model : SizeName,
                                as : 'sizeName',
                            },
                            {
                                model: SizeType,
                                as: 'sizeType',
                            }
                        ]
                    }
                ]
            });
        }
        else if (sizeNameId) {
            products = await Product.findAndCountAll({
                order,
                distinct : true,
                limit,
                offset: page,
                where : {
                    [Op.and] : [
                        {
                            subcategorieId
                        },
                        {
                            price : {
                                [Op.between] : range
                            }
                        },
                        {
                            product_status : true
                        }
                    ]
                },
                include : [
                    {
                        model : Brand,
                        as : 'brand'
                    },
                    {
                        model : Stock,
                        as : 'stocks',
                        where : {
                            sizeNameId          
                        },
                        include : [
                            {
                                model : SizeName,
                                as : 'sizeName',
                            },
                            {
                                model: SizeType,
                                as: 'sizeType',
                            }
                        ]
                    }
                ]
            });
        }
        else{
            products = await Product.findAndCountAll({
                order,
                distinct : true,
                limit,
                offset: page,
                where : {
                    [Op.and] : [
                        {
                            subcategorieId
                        },
                        {
                            price : {
                                [Op.between] : range
                            }
                        },
                        {
                            product_status : true
                        }
                    ]
                },
                include : [
                    {
                        model : Brand,
                        as : 'brand'
                    },
                    {
                        model : Stock,
                        as : 'stocks',
                        include : [
                            {
                                model : SizeName,
                                as : 'sizeName',
                            },
                            {
                                model: SizeType,
                                as: 'sizeType',
                            }
                        ]
                    }
                ]
            });
        }
        return res.json({
            products: products.rows,
            count : products.count
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});



// @route POST v1/products/brand/:brand_id
// @desc Get all products by brand
/* @sortBy: 
        createdAt    /products/brand?sortBy=createdAt:desc || asc
        price_tmt    /products/brand?sortBy=price_tmt:desc || asc
*/
/* @filter : 
      price_range: /products/brand?priceRange=20:100
      brand:   /products/brand?brand=brand_id                     
*/
/* @limit&pagination : /products/brand?limit=10&page=2 */

// @access Public
router.get('/brand/:brand_id', async (req,res) => {


    let order = [];
    let page = 0;
    let limit = 5;
    let subcategorie = null;
    let brand = null;
    // 
    let products = [];

    // Sorting
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        order.push(parts);
    }
    // limit
    if (req.query.limit) {
        limit = Number(req.query.limit)
    }
    // page
    if (req.query.page) {
        page = Number(req.query.page)
    }


    try {

        // if brand
        if(req.query.subcategorie){
            const findSubcategorie = await SubCategorie.findOne({ where: { subcategorie_id: req.query.subcategorie } });
            if(!findSubcategorie) return res.status(404).json({msg : 'Subcategorie not found!'})
            subcategorie = findSubcategorie.id
        }
        // if brand
        if(req.params.brand_id){
        const findBrand = await Brand.findOne({ where: { brand_id: req.params.brand_id } });
        if(!findBrand) return res.status(404).json({msg : 'Brand not found!'})
        brand = findBrand.id
        }

        products = await Product.findAndCountAll({
            where : {
                [Op.and] : [
                    {
                        brandId : brand
                    },
                    {
                        product_status : true
                    }
                ]
            },
            distinct : true,
            order,
            limit,
            offset: page,
            include : [
                {
                    model : Brand,
                    as : 'brand'
                },
                {
                    model : Stock,
                    as : 'stocks',
                    include : [
                        {
                            model : SizeName,
                            as : 'sizeName',
                        },
                        {
                            model: SizeType,
                            as: 'sizeType',
                        }
                    ]
                }
            ]
        });
        return res.json({
        products: products.rows,
        count : products.count
    })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});



// @route POST v1/products?search=adidas
// @desc Get all products by search
/* @sortBy: 
        createdAt    /products?sortBy=createdAt:desc || asc
        price_tmt    /products?sortBy=price_tmt:desc || asc
*/
/* @filter : 
      price_range: /products?priceRange=20:100
      brand:   /products?brand=brand_id                 
*/
/* @limit&pagination : /products?limit=10&page=2 */

// @access Public
router.get('/search', async (req,res) => {


    let order = [];
    let page = 0;
    let limit = 5;
    let searchArray = ['', '', '',''];
    // 
    let products = [];

    // Sorting
   if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        order.push(parts);
    }
    // limit
    if (req.query.limit) {
        limit = Number(req.query.limit)
    }
    // page
    if (req.query.page) {
        page = Number(req.query.page)
    }

    // search
    if (req.query.search) {
        searchQuery = '%' + req.query.search + '%';
        searchArray[0] = searchQuery.toLowerCase();
        searchArray[1] = searchQuery.toUpperCase();
        searchArray[2] = searchQuery.charAt(0) + searchQuery.charAt(1).toUpperCase() + searchQuery.slice(2);
        searchArray[3] = searchQuery.charAt(0) + searchQuery.charAt(1).toUpperCase() + searchQuery.slice(2).toLowerCase();
    }


    try {

        products = await Product.findAndCountAll({
            where : {
                product_status: true
            },
            order,
            limit,
            offset: page,
            distinct : true,
            where : {
                [Op.and] : [
                    {
                        [Op.or]: [
                            {
                                product_name_tm: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                            {
                                product_name_ru: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                            {
                                product_name_en: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                            {
                                description_tm: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                            {
                                description_ru: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                            {
                                description_en: {
                                    [Op.like]: {
                                        [Op.any]: searchArray
                                    }
                                }
                            },
                        ]
                    },
                    {
                        product_status: true
                    },
                ]
            },
            include : [
                {
                    model : Brand,
                    as : 'brand',
                },
                {
                    model : SubCategorie,
                    as : 'subcategorie',
                },
                {
                    model : Stock,
                    as : 'stocks',
                    include : [
                        {
                            model : SizeName,
                            as : 'sizeName',
                       },
                       {
                          model: SizeType,
                          as: 'sizeType',
                       }
                    ]
                }
            ]
        });
        return res.json({
            products: products.rows,
            count : products.count
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});



// @route GET api/products/:product_id
// @desc Get Product by id
// @access Public
router.get('/:product_id', async (req, res) => {

    try {
       const product = await Product.findOne({
          where: {
             product_id: req.params.product_id
          },
          include : [
            {
                model : Brand,
                as : 'brand',
                attributes : ['brand_id','brand_name']
            },
            {
                model : SubCategorie,
                as : 'subcategorie',
                attributes : ['subcategorie_id', 'subcategorie_name_tm', 'subcategorie_name_ru', 'subcategorie_name_en']
            },
            {
                model : Store,
                as : 'store',
                attributes : ['store_id','store_name']
            },
            {
                model : Stock,
                as : 'stocks',
                include : [
                    {
                        model : SizeName,
                        as : 'sizeName',
                   },
                   {
                      model: SizeType,
                      as: 'sizeType',
                   }
                ]
            }
          ]
       });
 
       if (!product) res.status(404).send('Product not found');
 
       res.json(product);
    } catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});

// @route GET api/products/:product_id
// @desc Get Product by id
// @access Public
router.get('/related-products/:product_id', async (req, res) => {

    try {
       const product = await Product.findOne({
          where: {
             product_id: req.params.product_id
          },
       });
 
       if (!product) res.status(404).send('Product not found');


       const productArray = await Product.findAll({
           where : {
                [Op.and] : [
                    {
                        subcategorieId : product.subcategorieId 
                    },
                    {
                        product_id : {[Op.not]: product.product_id},   
                    },
                    {
                        product_status : true
                    }
                ]
           },
           include : [
            {
                model : Brand,
                as : 'brand',
            },
            {
                model : SubCategorie,
                as : 'subcategorie',
            },
            {
                model : Stock,
                as : 'stocks',
                include : [
                    {
                        model : SizeName,
                        as : 'sizeName',
                   },
                   {
                      model: SizeType,
                      as: 'sizeType',
                   }
                ]
            }
        ]
       })
 
       res.json(productArray);
    }
    catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});


// @route DELETE api/products/:product_id
// @desc Delete Product
// @access Private (Admin)
// TODO AUTH
router.delete('/:product_id', async (req, res) => {
    try {

        const product = await Product.findOne({ where: { product_id: req.params.product_id } });

        if(!product) {
            return res.status(404).send('Product not found');
        }

        await Product.destroy({
            where: {
                product_id: req.params.product_id
            }
        });

        if(product.product_images){
            product.product_images.forEach((image) => {
                fs.unlinkSync(config.get('rootPath') + image)
            })
        }

        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route PATCH v1/products/:product_id
// @desc Update Product
// @access Private(admin)
// TODO AUTH
router.patch('/:product_id', async (req, res) => {

    let newObj = {};

    const {
       product_code,
       product_name_tm,
       product_name_en,
       product_name_ru,
       description_tm,
       description_ru,
       description_en,
       price_tmt,
       price_usd,
       old_price_tmt,
       old_price_usd,
       subcategorie_id,
       brand_id,
       store_id,
       stocks
    } = req.body;

    // Validate
    if (!product_code) return res.status(400).send('Input Product Code');
    if (!product_name_tm) return res.status(400).send('Input Product Name');
    if (!product_name_en) return res.status(400).send('Input Product Name');
    if (!product_name_ru) return res.status(400).send('Input Product Name');
    if (!price_tmt && !price_usd) return res.status(400).send('Input Product Price');
    if (!subcategorie_id) return res.status(400).send('Input Subcategorie');


    if (product_code) newObj.product_code = product_code;
    if (product_name_tm) newObj.product_name_tm = product_name_tm;
    if (product_name_en) newObj.product_name_en = product_name_en;
    if (product_name_ru) newObj.product_name_ru = product_name_ru;
    if (description_tm) newObj.description_tm = description_tm;
    if (description_ru) newObj.description_ru = description_ru;
    if (description_en) newObj.description_en = description_en;
    if (price_tmt) newObj.price_tmt = price_tmt;
    if (price_usd) newObj.price_usd = price_usd;
    if (old_price_tmt) newObj.old_price_tmt = old_price_tmt;
    if (old_price_usd) newObj.old_price_usd = old_price_usd;
      if (price_usd) newObj.isPriceUsd = true;
   

    try {

        // Subcategorie
        const subcategorie = await SubCategorie.findOne({where : {subcategorie_id} });
        if(!subcategorie) return res.status(404).send('Subcategorie not found!');
        newObj.subcategorieId = subcategorie.id;

        // Brand
        if(brand_id){
            const brand = await Brand.findOne({where : {brand_id} });
            if(!brand) return res.status(404).send('Brand not found!'); 
            newObj.brandId = brand.id;
        }
        else{
            newObj.brandId = null
        }

        // Store 
        if(store_id){
            const store = await Store.findOne({where : {store_id} });
            if(!store) return res.status(404).send('Store not found!');
            newObj.storeId = store.id;
        }


        // Price settings
        if(price_usd){
            newObj.price_tmt = null;
            newObj.old_price_tmt = null;
            const currencies = await Currency.findAll();
            const currency = currencies[currencies.length - 1];
            newObj.price = currency.currency_price * price_usd;
            if(old_price_usd){
                newObj.old_price = currency.currency_price * old_price_usd;
            }
        }
        if(price_tmt){
            newObj.price = price_tmt;
            if(old_price_tmt){
                newObj.old_price = old_price_tmt;
            }
        }

        const calculateDiscount = (val,old_val) => {
            return Math.floor(100 - (val * 100 / old_val))
        }
        if(newObj.old_price){
            const discount = calculateDiscount(newObj.price,newObj.old_price);
            newObj.product_discount = discount;
        } 


        const product = await Product.findOne({where : {product_id : req.params.product_id}});
        await Product.update(newObj, {where : {product_id : req.params.product_id}});


        // Create Product Stocks
       if (stocks) {
            if(stocks.length > 0){
                // If stock id exists then update
                if(stocks[0].stock_id){
                    stocks.forEach(async (stock) => {

                        let sizeType = null;
                        let sizeName = null;
    
                        if (stock.size_type_id) {
                            // Find Size Type
                            sizeType = await SizeType.findOne({
                               where: {
                                  size_type_id: stock.size_type_id
                               }
                            });
                            if (!sizeType) return res.status(404).send('Size Type not found!');
                        }
                        if (stock.size_name_id) {
                            // Find Size Name
                            sizeName = await SizeName.findOne({
                               where: {
                                  size_name_id: stock.size_name_id
                               }
                            });
                            if (!sizeName) return res.status(404).send("Size Name Not found")
                        }
                        await Stock.update({
                            stock_quantity : stock.stock_quantity,
                            sizeTypeId : sizeType ? sizeType.id : null,
                            sizeNameId : sizeName ? sizeName.id : null,
                            productId : product.id
                        },{
                            where : {
                                stock_id : stock.stock_id
                            }
                        });
                    })
                }
                // If stock id not exists then create
                else{
                    await Stock.destroy({where : {productId : product.id}});
                    stocks.forEach(async (stock) => {

                        let sizeType = null;
                        let sizeName = null;
    
                        if(stock.size_type_id){
                            // Find Size Type
                            sizeType = await SizeType.findOne({where:{size_type_id : stock.size_type_id}});
                            if(!sizeType)  return res.status(404).send('Size Type not found!');
                        }
    
                        if(stock.size_name_id){
                            // Find Size Name
                            sizeName = await SizeName.findOne({where:{size_name_id : stock.size_name_id}});
                            if(!sizeName) return res.status(404).send("Size Name Not found")
                        }
    
                        if(stock.stock_id){
                            await Stock.update({
                                stock_quantity : stock.stock_quantity,
                                sizeTypeId : sizeType ? sizeType.id : null,
                                sizeNameId : sizeName ? sizeName.id : null,
                                productId : product.id
                            }, {where : {
                                stock_id : stock.stock_id
                            }});
                        }
                        else{
                            await Stock.create({
                                stock_quantity : stock.stock_quantity,
                                sizeTypeId : sizeType ? sizeType.id : null,
                                sizeNameId : sizeName ? sizeName.id : null,
                                productId : product.id
                            });
                        }
                    })
                }
            }
        }


        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});



// @route Post v1/products/:products_id
// desc  Create Product Image
// access Private (Admin)
// TODO AUTH
const upload = multer({

    limits: {
       fileSize: 10000000
    },
    fileFilter(req, file, cb) {
       if (!file.originalname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
          return cb(new Error('Please upload image formats'))
       }
       cb(undefined, true)
    }
 });
 
router.post('/image/:product_id', upload.array('images'), async (req, res) => {
 
    try {
        // Check Product if exists
        const product = await Product.findOne({where : {product_id : req.params.product_id}});

        if (!product) {
            return res.status(404).send('Product not found')
        }

        // Delete product images already exists 
        if(product.product_images){
            product.product_images.forEach((image) => {
                fs.unlinkSync(config.get('rootPath') + image);  
            })
        }
        // Delete product preview image already exists 
        if(product.preview_image){
            fs.unlinkSync(config.get('rootPath') + product.preview_image);  
        }

        let pr_images = [];
        let prev_image = '';
        let buffers = req.files;
    
        // Convert image to png with sharp 
        buffers.forEach(async (file, index) => {
            // Create images path for db
            pr_images.push(`/product-images/${buffers[index].originalname + '-' + product.id}.webp`)

            if (index === 0) {

                // Create imagepath for db
                prev_image = `/product-images/preview-image-${buffers[index].originalname + '-' + product.id}.webp`;

                // product preview image
                await sharp(file.buffer).resize({
                    width: 500,
                    height: 500
                }).webp().toFile(`./public/product-images/preview-image-${buffers[index].originalname + '-' + product.id}.webp`);

                // 
                await sharp(file.buffer)
                    .webp()
                    .toFile(`./public/product-images/${buffers[index].originalname + '-' + product.id}.webp`);
            }
            else {
                await sharp(file.buffer)
                    .webp()
                    .toFile(`./public/product-images/${buffers[index].originalname + '-' + product.id}.webp`)
            }
        });

    
        product.product_images = pr_images;
        if(!prev_image !== ''){
            product.preview_image = prev_image;
        }

        product.save();



        return res.json({prev_image, pr_images});
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
 },
    (error, req, res, next) => {
       res.status(400).send({
          error: error.message
       })
});



// @route PATCH api/products/status/:product_id
// desc  Change product status : true / false
// access Private (Admin) 
// TODO AUTH
router.patch('/status/:product_id', async (req, res) => {

   let status = req.body.product_status ? 1 : 0;


   try {

      const product = await Product.findOne({ where: { product_id: req.params.product_id } });

      if (!product) return res.status(404).send('Product not found');

      await Product.update({
         product_status : Boolean(status)
      },{
         where: {
            product_id: req.params.product_id
         }
      });



      res.json(status);

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
 });


router.get('/home/top-products', async (req,res) => {

    try {
        const newProducts = await Product.findAll({
            order : [['createdAt','DESC']],
            where : {
                product_status : true
             },
            limit: 5,
            include: [{
                  model: Brand,
                  as: 'brand'
               },
               {
                  model: Stock,
                  as: 'stocks',
                  include: [{
                        model: SizeName,
                        as: 'sizeName',
                     },
                     {
                        model: SizeType,
                        as: 'sizeType',
                     }
                  ]
               }
            ]
         });
  
         const discountProducts = await Product.findAll({
            where: {
                [Op.and] : [
                    {
                        old_price: {
                            [Op.not] : null
                        }
                    },
                    {
                        product_status: true
                    }
                ]
            },
            limit : 5,
            include : [
               {
                     model : Brand,
                     as : 'brand'
               },
               {
                     model : Stock,
                     as : 'stocks',
                     include : [
                        {
                           model : SizeName,
                           as : 'sizeName',
                        },
                        {
                           model: SizeType,
                           as: 'sizeType',
                        }
                     ]
               }
            ]
         });
   
         res.json({
             newProducts,
             discountProducts
         });    
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
})
 


module.exports = router;