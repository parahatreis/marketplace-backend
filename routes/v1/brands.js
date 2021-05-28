const express = require('express');
const router = express.Router();
const { Brand, SubCategorie, BrandSubcategorie} = require('../../models');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
const fs = require('fs')
const config = require('config');



// @route POST v1/brands
// @desc Create Brand
// @access Private(Admin)
// TODO Auth
router.post('/', async (req, res) => {

   const {
      brand_name,
      subcategories
   } = req.body;


   if(!brand_name) return res.status(400).send("Input Brand Name");
   if(!subcategories) return res.status(400).send("Input Subcategories");
   if(subcategories.length === 0) return res.status(400).send("Input Subcategories");

   try {      
      // create brand 
      const brand = await Brand.create({
         brand_name,
      });

      // create brand_subcategories
      subcategories.forEach(async (subcat) => {
         // find subcategories to get ids
         const subcategorie = await SubCategorie.findOne({
            where : {
               subcategorie_id : subcat.subcategorie_id
            },
            attributes : ['subcategorie_id','id']
         });

         // Craete BrandSubcategorie
         await BrandSubcategorie.create({
            brandId : brand.id,
            subcategorieId : subcategorie.id
         })
      })

      res.json(brand);
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
 });

 
// @route GET v1/brands  
//            v1/brands/subcategories=false
// @desc Get all Brands
// @access Public
router.get('/', async (req, res) => {

   // to get subcats of brands
   const include_subcategories = req.query.subcategories === 'true';

   let brands = []

   try {
      if(include_subcategories){
         brands = await Brand.findAll({
            include : [
               {
                  model : SubCategorie,
                  as : 'subcategories',
                  attributes : ['subcategorie_id','subcategorie_name_tm','subcategorie_name_ru','subcategorie_name_en']
               }
            ]
         });
      }
      else{
         brands = await Brand.findAll();
      }      

      res.json(brands);
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});


// @route GET v1/brands/:brand_id
// @desc Get Brand by id
// @access Public
router.get('/:brand_id', async (req, res) => {

   try {
      const brand = await Brand.findOne({
         where: {
            brand_id : req.params.brand_id
         },
         include : [
            {
               model : SubCategorie,
               as : 'subcategories',
               attributes : ['subcategorie_id','subcategorie_name_tm','subcategorie_name_ru','subcategorie_name_en']
            }
         ]
      });

      if (!brand) res.status(404).send('Brand not found !');

      res.json(brand);

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});
 


// @route DELETE v1/brands/:brand_id
// @desc Delete Brand
// @access Private(Admin)
// TODO AUTH
router.delete('/:brand_id', async (req, res) => {
   try {
      
      const brand = await Brand.findOne({ where: { brand_id: req.params.brand_id } });
      if (!brand) res.status(404).send('Brand not found !');
      
      await Brand.destroy({ where: { brand_id: req.params.brand_id } });
      await BrandSubcategorie.destroy({where : {brandId : brand.id}});

      if(brand.brand_image){
         fs.unlinkSync(config.get('rootPath')  + brand.brand_image)
      }

      res.json('Brand Deleted');
   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});


// @route PATCH v1/brands/:brand_id
// @desc Update Brand
// @access Private(Admin)
// TODO AUTH
router.patch('/:brand_id', async (req, res) => {

   let newObj = {};

   const {
      brand_name,
      subcategories
   } = req.body;

   if(!brand_name) return res.status(400).send("Input Brand Name");
   if(!subcategories) return res.status(400).send("Input Subcategories");

   if (brand_name) newObj.brand_name = brand_name;

   try {

      const brand = await Brand.findOne({where : {brand_id : req.params.brand_id}});
      if(!brand) return res.status(404).send('Brand not found')


      // Delete all brand_subcategories if subcategories is empty
      if(subcategories.length === 0){
         await BrandSubcategorie.destroy({where : {brandId : brand.id}});
      }
      else{
         await BrandSubcategorie.destroy({where : {brandId : brand.id}});
         // create brand_subcategories
         subcategories.forEach(async (subcat) => {
            // find subcategories to get ids
            const subcategorie = await SubCategorie.findOne({
               where : {
                  subcategorie_id : subcat.subcategorie_id
               },
               attributes : ['subcategorie_id','id']
            });

            // Craete BrandSubcategorie
            await BrandSubcategorie.create({
               brandId : brand.id,
               subcategorieId : subcategorie.id
            })
         })
      }

      // update brand 
      brand.brand_name = newObj.brand_name;
      brand.save();

      return res.send('Updated');
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
 });


 
// @route Post v1/brands/:subcategorie_id
// desc  Create Subcategorie Image
// access Private (Admin)
// TODO AUTH
// Check file with multer
const upload = multer({
   limits: {
      fileSize: 2000000
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
         return cb(new Error('Please upload image formats'))
      }
      cb(undefined, true)
   }
});
router.post('/image/:brand_id', upload.single('image'), async (req, res) => {

   const brand = await Brand.findOne({ where: { brand_id: req.params.brand_id } });

   if (!brand) {
      return res.status(404).send('Brand not found')
   }

   // Delete if brand image already exists
   if(brand.brand_image){
      fs.unlinkSync(config.get('rootPath') + brand.brand_image);  
   }

   // Convert image to png with sharp 
   await sharp(req.file.buffer).resize({
      width: 300,
      height: 300
   }).webp().toFile(`./public/brand-images/${req.file.originalname + '-' + brand.id}.webp`)

   // Pathname of new brand image
   let image = `/brand-images/${req.file.originalname + '-' + brand.id}.webp`;

   brand.brand_image = image;

   brand.save();

   res.send(image);

},
(error, req, res, next) => {
   res.status(400).send({
      error: error.message
   })
});



 module.exports = router;