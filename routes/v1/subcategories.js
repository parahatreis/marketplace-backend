const express = require('express');
const router = express.Router();
const { SubCategorie ,Categorie,Brand, Product, SizeType, SizeName } = require('../../models');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
const fs = require('fs');
const config = require('config');



// @route POST v1/subcategories
// @desc Create Subcategorie
// @access Private(Admin)
// TODO AUTH
router.post('/', async (req, res) => {

   let newObj = {}

   const {
      subcategorie_name_tm,
      subcategorie_name_ru,
      subcategorie_name_en,
      categorie_id,
      size_type_id,
   } = req.body;

   if(!subcategorie_name_tm) return res.status(400).send('Input Subcategorie Name');
   if(!subcategorie_name_ru) return res.status(400).send('Input Subcategorie Name');
   if(!subcategorie_name_en) return res.status(400).send('Input Subcategorie Name');
   if(!categorie_id) return res.status(400).send('Choose categorie !')


   if (subcategorie_name_tm) newObj.subcategorie_name_tm = subcategorie_name_tm;
   if (subcategorie_name_ru) newObj.subcategorie_name_ru = subcategorie_name_ru;
   if (subcategorie_name_en) newObj.subcategorie_name_en = subcategorie_name_en;


   try {

      // find categorie by id
      const categorie = await Categorie.findOne({where : {categorie_id : categorie_id}});
      if(!categorie) res.status(404).send("Categorie not found!");

      // get categorie id
      newObj.categorieId = categorie.id;

      // Set Size Type
      if(size_type_id !== ''){
         const sizeType = await SizeType.findOne({where : {size_type_id}});
         if(!sizeType) return res.status(404).send('Size Type not found!')
         newObj.sizeTypeId = sizeType.id
      }
      if(size_type_id === ''){
         newObj.sizeTypeId = null;
      }

      const subcategorie = await SubCategorie.create(newObj);

      return res.json(subcategorie);

   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});



// @route GET v1/subcategorie
//             v1/subcategories/brands=false
// @desc Get all Subcategorie
// @access Public
router.get('/', async (req, res) => {

   // to get brands of subcats
   const include_brands = req.query.brands === 'true';
   let subcategories = []

   try {
      if(include_brands){
         subcategories = await SubCategorie.findAll({
            include : [{
               model : Brand,
               as : 'brands',
               attributes : ['brand_id','brand_name']
            },
            {
               model : Categorie,
               as : 'categorie',
               attributes : ['categorie_id','categorie_name_tm','categorie_name_ru','categorie_name_en']
            },
            {
               model : SizeType,
               as : 'sizeType',
            },
            {
               model : Product,
               as : 'products',
               attributes : ['product_id'] 
            }
         ]
         });
      }
      else{
         subcategories = await SubCategorie.findAll({
            include : [
               {
                  model : Categorie,
                  as : 'categorie',
                  attributes : ['categorie_id','categorie_name_tm','categorie_name_ru','categorie_name_en']
               },
               {
                  model : SizeType,
                  as : 'sizeType',
               },
            ]
         });
      }

      res.json(subcategories);
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});

// @route GET v1/subcategories/:subcategorie_id 
//            v1/subcategories/brands=false
// @desc Get Subcategorie by id
// @access Public
router.get('/:subcategorie_id', async (req, res) => {

    // to get brands of subcats
   const include_brands = Boolean(req.query.brands);
   
   console.log(include_brands)

   try {
      if(include_brands){
         subcategorie = await SubCategorie.findOne({
            where: { subcategorie_id: req.params.subcategorie_id },
            include : [
               {
                  model : Brand,
                  as : 'brands',
                  attributes : ['brand_id','brand_name']
               },
               {
                  model : SizeType,
                  as : 'sizeType',
                  include : {
                     model : SizeName,
                     as : 'size_names'
                  }
               },
               {
                  model : Categorie,
                  as : 'categorie',
                  attributes : ['categorie_id','categorie_name_tm','categorie_name_ru','categorie_name_en']
               },
            ]
         });
      }
      else{
         subcategorie = await SubCategorie.findOne({
            where: { subcategorie_id: req.params.subcategorie_id },
            include : [
               {
                  model : SizeType,
                  as : 'sizeType',
                  include : {
                     model : SizeName,
                     as : 'size_names'
                  }
               },
               {
                  model : Categorie,
                  as : 'categorie',
                  attributes : ['categorie_id','categorie_name_tm','categorie_name_ru','categorie_name_en']
               },
            ]
         });
      }

      if(!subcategorie) return res.status(404).send('Subcategorie not found !')

      res.json(subcategorie);
   }
   catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});



// @route PATCH api/subcategories/:subcategorie_id
// @desc Update Subcategorie
// @access Private(Admin)
// TODO AUTH
router.patch('/:subcategorie_id',  async (req, res) => {

   let newObj = {};

   const {
      subcategorie_name_tm,
      subcategorie_name_ru,
      subcategorie_name_en,
      categorie_id,
      size_type_id,
   } = req.body;

   if(!subcategorie_name_tm) return res.status(400).send('Input Subcategorie Name');
   if(!subcategorie_name_ru) return res.status(400).send('Input Subcategorie Name');
   if(!subcategorie_name_en) return res.status(400).send('Input Subcategorie Name');
   if(!categorie_id) return res.status(400).send('Choose categorie !')


   if (subcategorie_name_tm) newObj.subcategorie_name_tm = subcategorie_name_tm;
   if (subcategorie_name_ru) newObj.subcategorie_name_ru = subcategorie_name_ru;
   if (subcategorie_name_en) newObj.subcategorie_name_en = subcategorie_name_en;

   try {

      const findSubcategorie = await SubCategorie.findOne({where : {subcategorie_id : req.params.subcategorie_id}})
      if(!findSubcategorie) return res.status(404).send('Subcategorie Not found')

      // find categorie by id
      const categorie = await Categorie.findOne({where : {categorie_id : categorie_id}});
      if(!categorie) return res.status(404).send('Categorie Not found!')
      // get categorie id
      newObj.categorieId = categorie.id;

      // Set size type
      if(size_type_id !== ''){
         const sizeType = await SizeType.findOne({where : {size_type_id}});
         if(!sizeType) return res.status(404).send('Size Type not found!')
         newObj.sizeTypeId = sizeType.id
      }
      if(size_type_id === ''){
         newObj.sizeTypeId = null;
      }

      await SubCategorie.update(newObj, {
         where: {
            subcategorie_id: req.params.subcategorie_id
         }
      });
      res.json("Updated");

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});



// @route DELETE v1/subcategories/:subcategorie_id
// @desc Delete SubCategorie
// @access Private(Admin)
// TODO AUTH
router.delete('/:subcategorie_id', async (req, res) => {
   try {

      // delete categorie row
      const subcategorie = await SubCategorie.findOne({ where: { subcategorie_id: req.params.subcategorie_id } });

      if (!subcategorie) {
         return res.status(404).send('Subcategorie not found');
      }

      await SubCategorie.destroy({where: { subcategorie_id: req.params.subcategorie_id }});

      // delete file of subcategorie
      if(subcategorie.subcategorie_image){
         fs.unlinkSync(config.get('rootPath') + subcategorie.subcategorie_image)
      }
      res.status(200).json(subcategorie);

   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});



// @route Post v1/subcategories/:subcategorie_id
// desc  Create Subcategorie Image
// access Private(Admin)
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
router.post('/image/:subcategorie_id', upload.single('image'), async (req, res) => {

   const subcategorie = await SubCategorie.findOne({ where: { subcategorie_id: req.params.subcategorie_id } });

   if (!subcategorie) {
      return res.status(404).send('Subcategorie not found')
   }

   // Delete if subcategorie image already exists
   if(subcategorie.subcategorie_image){
      fs.unlinkSync(config.get('rootPath') + subcategorie.subcategorie_image);  
   }

   // Convert image to png with sharp 
   await sharp(req.file.buffer).resize({
      width: 1000,
      height: 1000
   }).webp().toFile(`./public/subcategorie-images/${req.file.originalname + '-' + subcategorie.id}.webp`)

   // Pathname of new subcategorie image
   let image = `/subcategorie-images/${req.file.originalname + '-' + subcategorie.id}.webp`;

   subcategorie.subcategorie_image = image;

   subcategorie.save();

   res.send(image);

},
(error, req, res, next) => {
   res.status(400).send({
      error: error.message
   })
});


module.exports = router;