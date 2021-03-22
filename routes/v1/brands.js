const express = require('express');
const router = express.Router();
const { Brand, SubCategorie ,BrandSubcategories} = require('../../models');
const { Op } = require('sequelize');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
const fs = require('fs')


// @route POST v1/brands
// @desc Create Brand
// @access Private(Admin)
router.post('/', async (req, res) => {

   const {
      brand_name,
      subcategories
   } = req.body;

   try {
      console.log(subcategories)

      // find subcategories to get ids
      const subcategorieArray = await SubCategorie.findAll({
         where : {
            subcategorie_id : subcategories
         },
         attributes : ['subcategorie_id','id']
      });

      // create brand 
      const brand = await Brand.create({
         brand_name,
      });

      // create brand_subcategories
      async function createBrandSubcategories(){
         subcategorieArray.forEach( async (val) => {
            await BrandSubcategories.create({
               brandId : brand.id,
               subcategorieId : val.id
            })
         })
      }

      createBrandSubcategories()

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
                  attributes : ['subcategorie_id','subcategorie_name']
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
               attributes : ['subcategorie_id','subcategorie_name']
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
router.delete('/:brand_id', async (req, res) => {
   try {
      
      const brand = await Brand.findOne({ where: { brand_id: req.params.brand_id }, attributes : ['brand_id','id'] });

      if (!brand) {
         return res.status(404).send('Brand not found');
      }
      
      await Brand.destroy({ where: { brand_id: req.params.brand_id } });
      await BrandSubcategories.destroy({where : {brandId : brand.id}});


      if(brand.brand_image){
         fs.unlinkSync(brand.brand_image)
      }

      res.json(brand);
   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});


// @route PATCH v1/brands/:brand_id
// @desc Update Brand
// @access Private(Admin)
router.patch('/:brand_id', async (req, res) => {

   let newObj = {};
   let subcategorieArray = [];

   const {
      brand_name,
      subcategories
   } = req.body;

   if (brand_name) newObj.brand_name = brand_name;
   if (subcategories) newObj.subcategories = subcategories;

   try {


      const brand = await Brand.findOne({where : {brand_id : req.params.brand_id}});
      if(!brand) return res.status(404).send('Brand not found')
      

      if(newObj.subcategories){
         if(newObj.subcategories.length > 0){
            // find subcategories to get ids
            subcategorieArray = await SubCategorie.findAll({
               where : {
                  subcategorie_id : subcategories
               },
               attributes : ['subcategorie_id','id']
            });
         }
      }

      if(newObj.brand_name){
         // update brand 
         brand.brand_name = newObj.brand_name;
         brand.save();
      }

      async function createBrandSubcategories(){
         if(subcategorieArray.length > 0){
            // Delete previous subcats
            await BrandSubcategories.destroy({where : {brandId : brand.id}});

            subcategorieArray.forEach( async (val) => {
               await BrandSubcategories.create({
                  brandId : brand.id,
                  subcategorieId : val.id
               })
            });
         }
      }

      // Delete all brand_subcategories if subcategories is empty
      if(newObj.subcategories){
         if(newObj.subcategories.length === 0){
            await BrandSubcategories.destroy({where : {brandId : brand.id}});
         }
      }

      createBrandSubcategories()

      return res.status(200).send('Updated');
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
 });


 
// @route Post v1/brands/:subcategorie_id
// desc  Create Subcategorie Image
// access Private (Admin)

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

   // Convert image to png with sharp 
   await sharp(req.file.buffer).resize({
      width: 300,
      height: 300
   }).webp().toFile(`./public/brand-images/${req.file.originalname + '-' + req.params.brand_id}.webp`)

   // Pathname of new brand image
   let image = `./public/brand-images/${req.file.originalname + '-' + req.params.brand_id}.webp`;

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