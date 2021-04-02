const express = require('express');
const router = express.Router();
const { Banner } = require('../../models');
// File Upload Multer
const multer = require('multer');
// Sharp to image converter
const sharp = require('sharp');
const fs = require('fs')
const config = require('config');


// @route POST v1/banners
// @desc Create Banner
// @access Private (Admin)
router.post('/', async (req, res) => {

    const newObj = {};

    const {
        banner_name,
        banner_url,
    } = req.body;

    if (banner_name) newObj.banner_name = banner_name;
    if (banner_url) newObj.banner_url = banner_url;

    try {

        const banner = await Banner.create(newObj);

        res.json(banner);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});

// @route GET api/banners
// @desc Get all Banners
// @access Public
router.get('/', async (req, res) => {
    try {
       const banners = await Banner.findAll();
       res.json(banners);
    }
    catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});


// @route GET api/banners/:banner_id
// @desc Get Banner By id
// @access Public
router.get('/:banner_id', async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where : {
                banner_id : req.params.banner_id
            }
        });

        if(!banner) return res.status(404).send('Banner Not found !')

        res.json(banner);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route PATCH api/banners/:banner_id
// @desc Update Banner
// @access Private (only Admin)
router.patch('/:banner_id', async (req, res) => {

    const newObj = {};

    const {
        banner_name,
        banner_url,
    } = req.body;

    if (banner_name) newObj.banner_name = banner_name;
    if (banner_url) newObj.banner_url = banner_url;

 
    try {
       const banner = await Banner.update(newObj, {
          where: {
            banner_id: req.params.banner_id
          }
       });
 
       if (!banner) {
          return res.status(404).send('banner not found');
       }
 
       res.json(banner);

    } catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});

// @route DELETE api/banners/:banner_id
// @desc Delete Store
// @access Private (only Admin)
router.delete('/:banner_id', async (req, res) => {
    try {
       const banner = await Banner.destroy({
          where: {
            banner_id: req.params.banner_id
          }
       });
 
       if (!banner) {
          return res.status(404).send('banner not found');
       }
       res.json(banner);

    } catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});


// @route Post v1/banner/image/:banner_id
// desc  Create Banner Image
// access Private(Admin)

// Check file with multer
const upload = multer({
    limits: {
       fileSize: 5000000
    },
    fileFilter(req, file, cb) {
       if (!file.originalname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
          return cb(new Error('Please upload image formats'))
       }
       cb(undefined, true)
    }
 });
 router.post('/image/:banner_id', upload.single('image'), async (req, res) => {
 
    try {
        const banner = await Banner.findOne({
            where: { banner_id: req.params.banner_id },
        });

        if (!banner) {
            return res.status(404).send('Banner not found')
        }

        // Delete if categorie image already exists
        if(banner.banner_image){
            fs.unlinkSync(config.get('rootPath') + banner.banner_image);  
        }

        // Convert image to png with sharp
        //    TODO Image Ratio
        await sharp(req.file.buffer).resize({
            width: 1200,
            height: 600
        }).webp().toFile(`./public/banner-images/${req.file.originalname+ '-' + banner.id}.webp`)

        // Pathname of new banner image
        let image = `/banner-images/${req.file.originalname + '-' + banner.id}.webp`;

        banner.banner_image = image;

        banner.save();

        return res.send(image);   
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
 



module.exports = router;