const express = require('express');
const router = express.Router();
const { SubCategorie ,Categorie,Brand } = require('../../models');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
const fs = require('fs')



// @route POST v1/subcategories
// @desc Create Subcategorie
// @access Private(Admin)
router.post('/', async (req, res) => {

   let newObj = {}

   // @TODO sizeType
   const {
      subcategorie_name,
      categorieId,
      hasSize,
      hasColor,
      sizeType,
   } = req.body;

   if (subcategorie_name) newObj.subcategorie_name = subcategorie_name;
   if (hasColor !== null) newObj.hasColor = hasColor;
   if (hasSize !== null) newObj.hasSize = hasSize;
   // if (sizeType) newObj.sizeType = sizeType;

   if(!categorieId) return res.status(400).send('Choose categorie !')


   try {

      // find categorie by id
      const categorie = await Categorie.findOne({where : {categorie_id : categorieId}});

      if(!categorie) res.status(404).send("Categorie not found!");

      // get categorie id
      newObj.categorieId = categorie.id;

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
            }]
         });
      }
      else{
         subcategories = await SubCategorie.findAll();
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
    const include_brands = req.query.brands === 'true';
    let subcategorie = []

   try {
      if(include_brands){
         subcategorie = await SubCategorie.findAll({
            where: { subcategorie_id: req.params.subcategorie_id },
            include : [{
               model : Brand,
               as : 'brands',
               attributes : ['brand_id','brand_name']
            },'categorie']
         });
      }
      else{
         subcategorie = await SubCategorie.findAll({
            where: { subcategorie_id: req.params.subcategorie_id },
            include :'categorie'
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
router.patch('/:subcategorie_id',  async (req, res) => {

   let newObj = {};

   const {
      subcategorie_name,
      hasSize,
      hasColor,
      sizeType,
      categorieId,
   } = req.body;

   if (subcategorie_name) newObj.subcategorie_name = subcategorie_name;
   if (hasColor !== null) newObj.hasColor = hasColor;
   if (hasSize !== null) newObj.hasSize = hasSize;
   // if (sizeType) newObj.sizeType = sizeType;

   try {

      // find categorie by id
      if(categorieId){
         const categorie = await Categorie.findOne({where : {categorie_id : categorieId}});
         // get categorie id
         newObj.categorieId = categorie.id;
      }

      const subcategorie = await SubCategorie.update(newObj, {
         where: {
            subcategorie_id: req.params.subcategorie_id
         }
      });

      if (!subcategorie) {
         return res.status(404).send('Subcategorie not found');
      }

      res.json(subcategorie);
   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
   }
});



// @route DELETE v1/subcategories/:subcategorie_id
// @desc Delete SubCategorie
// @access Private(Admin)
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
         fs.unlinkSync(subcategorie.subcategorie_image)
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

   // Convert image to png with sharp 
   await sharp(req.file.buffer).resize({
      width: 1000,
      height: 1000
   }).webp().toFile(`./public/subcategorie-images/${req.file.originalname + '-' + req.params.subcategorie_id}.webp`)

   // Pathname of new subcategorie image
   let image = `./public/subcategorie-images/${req.file.originalname + '-' + req.params.subcategorie_id}.webp`;

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