const express = require('express');
const router = express.Router();
// 
const {SizeType, SizeName} = require('../../models');
const adminAuth = require("../../middleware/adminAuth");


// @route POST v1/size_types
// @desc Create SizeType
// @access Private (Admin)
router.post('/', adminAuth, async (req, res) => {

    const {
        size_type,
        size_names
    } = req.body;

    // Check subcategorie exists
    if(!size_type){
        return res.status(400).send('Please input Size Type')
    }
    // Check subcategorie exists
    if(!size_names || size_names.length === 0){
        return res.status(400).send('Please input Size Names')
    }

    try {

        // Create Size Type
        const sizeType = await SizeType.create({
            size_type
        });

        // Create All Size Names
        if(size_names.length > 0){
            size_names.forEach(async name => {
                await SizeName.create({
                    size_name : name.size_name,
                    sizeTypeId : sizeType.id
                })
            });
        }

        res.send({
            sizeType,
            size_names
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route GET v1/size_types
// @desc Get all Size Types
// @access Private
router.get('/', async (req, res) => {
    try {
       const sizeTypes = await SizeType.findAll({
         include : [
             {
                model : SizeName,
                as : 'size_names',
                attributes : ["size_name_id","size_name"]
             }
         ]
       });
       res.json(sizeTypes);
    }
    catch (error) {
       console.log(error);
       res.status(500).send('Server error')
    }
});

// @route GET v1/size_types/:size_type_id
// @desc Get Size Type By id
// @access Private
router.get('/:size_type_id', adminAuth, async (req, res) => {
    try {
        const sizeType = await SizeType.findOne({
            where : {
                size_type_id : req.params.size_type_id
            },
            include : [
                {
                    model : SubCategorie,
                    as : 'subcategorie',
                    attributes : ['subcategorie_id','subcategorie_name']
                 },
                 {
                    model : SizeName,
                    as : 'size_names',
                    attributes : ["size_name_id","size_name"]
                 }
             ]
        });

        if(!sizeType) return res.status(404).send('SizeType Not found !')

        res.json(sizeType);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route DELETE api/stores/:store_id
// @desc Delete Store
// @access Private (only Admin)
router.delete('/:size_type_id', adminAuth, async (req, res) => {
    try {

        const sizeType = await SizeType.findOne({where : {size_type_id : req.params.size_type_id}})
        if(!sizeType) return res.status(404).send('SizeType Not found !')

        // delete all prev sizeTypes
        SizeName.destroy({where : { sizeTypeId : sizeType.id }});

        await SizeType.destroy({
            where : {
                size_type_id : req.params.size_type_id
            }
        });

        res.json(sizeType);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});


// @route PATCH v1/size_types/:size_type_id
// @desc Create SizeType
// @access Private (Admin)
router.patch('/:size_type_id', adminAuth, async (req, res) => {
    
    const newObj = {};
    let subcategorie = null;

    const {
        size_type,
        subcategorie_id,
        size_names
    } = req.body;


    // Check subcategorie exists
    if(size_type){
        newObj.size_type = size_type;
    }

    try {
        // Get size Type from DB
        const sizeType = await SizeType.findOne({where : {size_type_id : req.params.size_type_id}});
        if(!sizeType) return res.status(400).send('Size Type Not Found!')

        if(subcategorie_id){
            subcategorie = await SubCategorie.findOne({where : {subcategorie_id}});
            // Check subcategorie exists
            if(!subcategorie){
                return res.status(404).send('Subcategorie not found!')
            }
            newObj.subcategorieId = subcategorie.id;
        }

        // Create All Size Names
        if(size_names){
            if(size_names.length > 0){
                // delete all prev sizeTypes
                SizeName.destroy({where : { sizeTypeId : sizeType.id }});
                // delete
                size_names.forEach(async name => {
                    await SizeName.create({
                        size_name : name.size_name,
                        sizeTypeId : sizeType.id
                    })
                });
            }
        }

        // update size type
        await SizeType.update(newObj,{where : {size_type_id : req.params.size_type_id}})

        res.send("Updated");

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
});




module.exports = router;