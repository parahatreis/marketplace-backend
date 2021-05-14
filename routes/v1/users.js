const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
// Models
const { User, Order, OrderProduct
 } = require('../../models');
// auth
const userAuth = require('../../middleware/userAuth');


// @route POST v1/users
// @desc Register User
// @access Public
router.post('/', async (req, res) => {

    const {
        user_name,
        user_phone,
        user_password,
        user_email
    } = req.body;

    console.log(req.body)

    try {
        // Check user exists
        let user = await User.findOne({
            attributes : ['user_password'],
            where: {
                user_phone: user_phone
            }
        });

        if(user) return res.status(400).send('User already exists!')


        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        generated_password = await bcrypt.hash(user_password, salt);

        const newUser = await User.create({
            user_name,
            user_phone : Number(user_phone),
            user_password: generated_password,
            user_email
        });

        // Set token(JWT)
        const payload = {
            user: {
            id: newUser.user_id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '21600s'
        }, (err, token) => {
            if (err) throw err;
            res.json({
            newUser,
            token
            });
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }


});


// @route PATCH v1/users
// @desc Update User Info
// @access Private
router.patch('/', userAuth,  async (req, res) => {

    const {
        user_name,
        user_phone,
        user_address
    } = req.body;

    try {
        // Check user exists
        let user = await User.findOne({
            where: {
                user_id : req.user.id
            }
        });

        if(!user) return res.status(400).send('User not exists!')

        await User.update({
            user_name,
            user_phone : Number(user_phone),
            user_address
        },{
            where: {
                user_id : user.user_id
            }
        });

       res.json({
           msg : 'User updated'
       })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }


});

// @route POST v1/users/login
// @desc Login User
// @access Public
router.post('/login',async (req, res) => {

    const {
        user_phone,
        user_password
    } = req.body;


    try {
        // Check user exists
        let user = await User.findOne({
            where: {
                user_phone : Number(user_phone)
            }
        });
        // user checking
        if (!user) {
            return res.status(404).send("User not found!")
        }
        const isMatch = await bcrypt.compareSync(user_password, user.user_password);

        if (!isMatch) {
            return res.status(400).send("Password fail");
        }


        // Set token(JWT)
        const payload = {
            user: {
                id: user.user_id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '21600s'
        }, (err, token) => {
            if (err) throw err;
            res.json({
            token
            });
        })


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
});

// @route POST v1/users/login
// @desc Login User
// @access Public
router.post('/check-user',async (req, res) => {

    const {
        user_phone,
    } = req.body;

   console.log(req.body)

    try {
        // Check user exists
        let user = await User.findOne({
            where: {
                user_phone : Number(user_phone)
            }
        });
        // user checking
        if (user) {
            return res.status(400).send("User already exists!")
        }

        res.status(200).send()

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
});

// @route GET v1/auth
// @desc Get auht user
// @access Public
router.get('/auth',userAuth, async (req, res) => {
   try {
      const user = await User.findOne({
         where: {
            user_id : req.user.id
         },
         include : [
             {
                 model : Order,
                 as : 'orders',
             }
         ]
      })
      res.json(user)

   } catch (error) {
      console.log(error);
      res.status(400).send('Server error')
   }
});




module.exports = router;