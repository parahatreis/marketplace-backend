const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Product, Store, Brand,SubCategorie} = require('../../models');
const {Op} = require('sequelize')
// File Upload Multer
// const multer = require('multer');
// // Sharp to image converter
// const sharp = require('sharp');
// const fs = require('fs');


// TODO PRODUCT STOCK 
// @route POST v1/products
// @desc Create Product
// @access Private(admin)
router.post('/', async (req, res) => {

    let newObj = {};

    const {
        product_name,
        description,
        price_tmt,
        price_usd,
        isProductUsd,
        subcategorie_id,
        brand_id,
        store_id,
        //   stocks
    } = req.body;

    if(product_name) newObj.product_name = product_name;
    if(description) newObj.description = description;
    if(price_tmt) newObj.price_tmt = price_tmt;
    if(price_usd) newObj.price_usd = price_usd;
    if(isProductUsd) newObj.isProductUsd = isProductUsd;

    try {

        if(!subcategorie_id || !brand_id || !store_id){
            return res.status(400).send('Please input subcategorie or brand or store');
        }

        const subcategorie = await SubCategorie.findOne({where : {subcategorie_id} });
        if(!subcategorie){
            return res.status(404).send('Subcategorie not found!');
        }
        newObj.subcategorieId = subcategorie.id;

        const brand = await Brand.findOne({where : {brand_id} });
        if(!brand){
            return res.status(404).send('Brand not found!');
        }
        newObj.brandId = brand.id;


        const store = await Store.findOne({where : {store_id} });
        if(!store){
            return res.status(404).send('Store not found!');
        }
        newObj.storeId = store.id;

        const product = await Product.create(newObj);

        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route POST v1/products
// @desc Get all products
// @access Public(for admin)
router.get('/', async (req,res) => {
    try {
        const products = await Product.findAndCountAll({
            include : [
                {
                    model : SubCategorie,
                    as : 'subcategorie',
                    attributes : ['subcategorie_id', 'subcategorie_name']
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
                }
            ]
        });
        return res.json(products)
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
      TODO color: /products?color=blue                    
      TODO size: /products?size=M                         
*/
/* @limit&pagination : /products?limit=10&page=2 */

// @access Public
router.get('/subcategorie/:subcategorie_id', async (req,res) => {


    let order = [];
    let range = [0, Number.POSITIVE_INFINITY];
    let page = 0;
    let limit = 10;
    let brand = null;
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

        // if brand
        if(req.query.brand){
            const findBrand = await Brand.findOne({where : {brand_id : req.query.brand}});
            brand = findBrand.id
        }

        if(brand){
            products = await SubCategorie.findAndCountAll({
                where : {
                    subcategorie_id : req.params.subcategorie_id
                },
                include : [
                    {
                        model : Product,
                        as : 'products',
                        order,
                        limit,
                        offset: page,
                        where : {
                            [Op.and] : [
                                {brandId : brand},
                                {
                                    price_tmt : {
                                        [Op.between] : range
                                    }
                                }
                            ]
                        }
                    }
                ]
            });
        }
        else{
            products = await SubCategorie.findAndCountAll({
                where : {
                    subcategorie_id : req.params.subcategorie_id
                },
                include : [
                    {
                        model : Product,
                        as : 'products',
                        order,
                        limit,
                        offset: page,
                        where : {
                            price_tmt : {
                                [Op.between] : range
                            }
                        }
                    }
                ]
            });
        }
        return res.json(products)
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
      TODO color: /products?color=blue                    
      TODO size: /products?size=M                         
*/
/* @limit&pagination : /products/brand?limit=10&page=2 */

// @access Public
router.get('/brand/:brand_id', async (req,res) => {


    let order = [];
    let range = [0, Number.POSITIVE_INFINITY];
    let page = 0;
    let limit = 10;
    let subcategorie = null;
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

        // if brand
        if(req.query.subcategorie){
            const findSubcategorie = await SubCategorie.findOne({where : {subcategorie_id : req.query.subcategorie}});
            subcategorie = findSubcategorie.id
        }

        console.log('sub',subcategorie)

        if(subcategorie){
            products = await Brand.findAndCountAll({
                where : {
                    brand_id : req.params.brand_id
                },
                include : [
                    {
                        model : Product,
                        as : 'products',
                        order,
                        limit,
                        offset: page,
                        where : {
                            [Op.and] : [
                                {subcategorieId : subcategorie},
                                {
                                    price_tmt : {
                                        [Op.between] : range
                                    }
                                }
                            ]
                        }
                    }
                ]
            });
        }
        else{
            products = await Brand.findAndCountAll({
                where : {
                    brand_id : req.params.brand_id
                },
                include : [
                    {
                        model : Product,
                        as : 'products',
                        order,
                        limit,
                        offset: page,
                        where : {
                            price_tmt : {
                                [Op.between] : range
                            }
                        }
                    }
                ]
            });
        }
        return res.json(products)
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
      TODO color: /products?color=blue                    
      TODO size: /products?size=M                         
*/
/* @limit&pagination : /products?limit=10&page=2 */

// @access Public
router.get('/search', async (req,res) => {


    let order = [];
    let range = [0, Number.POSITIVE_INFINITY];
    let page = 0;
    let limit = 10;
    let subcategorie = null;
    let searchArray = ['', '', '',''];
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
            order,
            limit,
            offset: page,
            where : {
                price_tmt: {
                    [Op.between]: range
                },
                [Op.or]: [{
                    product_name: {
                        [Op.like]: {
                            [Op.any]: searchArray
                        }
                    }
                },
                {
                    description: {
                        [Op.like]: {
                            [Op.any]: searchArray
                        }
                    }
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
            ]
        });
        return res.json(products)
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
                attributes : ['subcategorie_id','subcategorie_name']
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


// @route DELETE api/products/:product_id
// @desc Delete Product
// @access Private (Admin)
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
                fs.unlinkSync(image)
            })
        }

        res.json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// TODO PRODUCT STOCK 
// @route PATCH v1/products/:product_id
// @desc Update Product
// @access Private(admin)
router.patch('/:product_id', async (req, res) => {

    let newObj = {};

    const {
        product_name,
        description,
        price_tmt,
        price_usd,
        isProductUsd,
        subcategorie_id,
        brand_id,
        store_id,
        //   stocks
    } = req.body;

    if(product_name) newObj.product_name = product_name;
    if(description) newObj.description = description;
    if(price_tmt) newObj.price_tmt = price_tmt;
    if(price_usd) newObj.price_usd = price_usd;
    if(isProductUsd) newObj.isProductUsd = isProductUsd;

    try {

        if(subcategorie_id){
            const subcategorie = await SubCategorie.findOne({where : {subcategorie_id} });
            if(!subcategorie){
                return res.status(404).send('Subcategorie not found!');
            }
            newObj.subcategorieId = subcategorie.id;
        }

        if(brand_id){
            const brand = await Brand.findOne({where : {brand_id} });
            if(!brand){
                return res.status(404).send('Brand not found!');
            }
            newObj.brandId = brand.id;
        }

        if(store_id){
            const store = await Store.findOne({where : {store_id} });
            if(!store){
                return res.status(404).send('Store not found!');
            }
            newObj.storeId = store.id;
        }

        const product = await Product.update(newObj, {where : {product_id : req.params.product_id}});

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
const upload = multer({

    limits: {
       fileSize: 10000000
    },
    fileFilter(req, file, cb) {
       if (!file.originalname.match(/\.(png|jpg|jpeg|svg)$/)) {
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

        let pr_images = [];
        let buffers = req.files;
    
        // Convert image to png with sharp 
        buffers.forEach(async (file, index) => {
            pr_images.push(`./public/product-images/${buffers[index].originalname + '-' + product.id}.webp`)
            if (index === 0) {
                await sharp(file.buffer).resize({
                    width: 700,
                    height: 700
                }).webp().toFile(`./public/product-images/${buffers[index].originalname + '-' + product.id}.webp`)
            }
            else {
                await sharp(file.buffer)
                    .webp()
                    .toFile(`./public/product-images/${buffers[index].originalname + '-' + product.id}.webp`)
            }
        });
    
        product.product_images = pr_images;

        product.save();

        return res.send(pr_images);
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
router.patch('/status/:product_id', async (req, res) => {

 
    let status = req.body.product_status;
 
    console.log(req.body.product_status)
    // if(req.body.product_status === 'true') status = true;
    // if(req.body.product_status === 'false') status = false;

 
    try {

        const product = await Product.findOne({where : {product_id: req.params.product_id}});

        if (!product) return res.status(404).send('Product not found');

        product.product_status = status;

        product.save();

        res.json(product);
 
    } catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
 });
 
 


module.exports = router;