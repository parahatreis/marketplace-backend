const express = require('express');
const router = express.Router();
// Models
const { Order , OrderProduct, Product, User, Stock, Store,SizeName } = require('../../models');
// auth
const userAuth = require('../../middleware/userAuth');

// @route POST v1/orders
// @desc Order Products
// @access Public(Auth User)
router.post('/', userAuth , async (req, res) => {

   let total_price = 0;
   let hasEnaughQuantity = true;

    const {
        products,
        address,
         payment_type,
    } = req.body;

   

    if(!products) return res.status(400).send('Please Choose Products')
    if(products.length === 0) return res.status(400).send('Please Choose Products');
    if(!address) return res.status(400).send('Input address');

   try {

        // Check stock quantity
        products.forEach(async (val,index) => {
           const findStock = await Stock.findOne({ where: { stock_id: val.stock_id } });

           if (findStock.stock_quantity < val.quantity) {
               hasEnaughQuantity = false;
                return res.status(400).json({msg : 'Ýeterlikli haryt mukdary ýok!'});
            }
            if(index === products.length - 1){
                createOrder()
            }
        })
      
      if (!hasEnaughQuantity) {
         return res.status(400).json({msg : 'Ýeterlikli haryt mukdary ýok!'});
      }

        async function createOrder(){
            // Get auth user
            const user = await User.findOne({
                where: {
                    user_id : req.user.id
                }
            });

            const order = await Order.create({
                userId : user.id,
                address : req.body.address,
                payment_type : req.body.payment_type
            })

           await products.forEach(async (val, index) => {
                const product = await Product.findOne({where : {product_id : val.product_id}}); 
                  const stock = await Stock.findOne({ where: { stock_id: val.stock_id } });
                  
                await OrderProduct.create({
                     productId : product.id,
                     orderId : order.id,
                     sold_price : product.price,
                     quantity: val.quantity,
                     sizeNameId: stock.sizeNameId
                });

                // Mukdar sany azalya
                stock.stock_quantity = Number(stock.stock_quantity) - val.quantity
                stock.save()
                
                total_price = total_price + (product.price * val.quantity);
                
                if(index === products.length - 1){
                    order.subtotal = total_price;
                    await order.save();
                    return res.json({msg : 'Sargyt ugradyldy!'})
                }
            });
        }
        

        

    } catch (error) {
        console.log(error);
        res.status(400).send('Server error')
    }
});


// @route POST v1/orders/check-stocks
// @desc Check Product Stocks
// @access Public
router.post('/check-stocks' , async (req, res) => {

   let lessStockProducts = [];

    const {
        products,
    } = req.body;

   

    if(!products) return res.status(400).send('Please Choose Products');
    if(products.length === 0) return res.status(400).send('Please Choose Products');

   try {

        // Check stock quantity
        await products.forEach(async (product,index) => {
            const findStock = await Stock.findOne({ 
                where: { stock_id: product.stock_id },
                include : {
                    model : SizeName,
                    as : 'sizeName'
                } 
            });
            if (findStock.stock_quantity < product.quantity) {
                if(findStock.sizeName){
                    lessStockProducts.push({
                        ...product,
                        sizeNameId : findStock.sizeName.size_name_id
                    })
                }
                else{
                    lessStockProducts.push(product)
                }
            }
            if(index === products.length - 1){
                return res.send(lessStockProducts)
            }
        });

        

    } catch (error) {
        console.log(error);
        res.status(400).send('Server error')
    }
});



// @route GET v1/orders
// @desc Get all orders
// @access Private
router.get('/' , async (req, res) => {

    try {
        
       const orders = await Order.findAll({
            order : [['createdAt', 'DESC']], 
            include : [
                {
                    model : OrderProduct,
                    as : 'order_products',
                  include: [
                       {
                          model: Product,
                          as: 'product',
                          attributes: ['product_id', 'product_name_tm', 'product_name_ru', 'product_name_en']
                        }
                    ]
              },
               {
                  model: User,
                  as: 'user',
                  attributes: ['user_id', 'user_name', 'user_phone']
               }
            ]
        });
        
        return res.json(orders)
 
    } catch (error) {
       console.log(error);
       res.status(400).send('Server error')
    }
});

// @route GET v1/orders
// @desc Get all orders
// @access Private
router.get('/user' , userAuth ,async (req, res) => {

    try {

        // Get auth user
        const user = await User.findOne({
            where: {
                user_id : req.user.id
            }
        });
        
        const orders = await Order.findAll({
            order : [['createdAt', 'DESC']], 
            include : [
                {
                    model : OrderProduct,
                    as : 'order_products',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        },
                        {
                            model: SizeName,
                            as: 'size_name',
                         },
                    ]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'user_name', 'user_phone']
                }
            ],
            where : {
                userId : user.id
            }
        });

        return res.json(orders)
 
    } catch (error) {
       console.log(error);
       res.status(400).send('Server error')
    }
});


// @route GET v1/orders/:order_id
// @desc Get order by id
// @access Public
router.get('/:order_id' , async (req, res) => {

   try {
      
      const orders = await Order.findOne({
         where : {order_id : req.params.order_id},
         include : [
               {
                  model : OrderProduct,
                  as : 'order_products',
                  include: [
                     {
                        model: Product,
                        as: 'product',
                        include: [
                           {
                              model: Store,
                              as : 'store'
                           }
                        ]
                     },
                     {
                        model: SizeName,
                        as: 'size_name',
                     },
                  ]
            },
            {
               model: User,
               as: 'user',
               attributes: ['user_id', 'user_name', 'user_phone']
            }
         ]
      });
      
      return res.json(orders)

   } catch (error) {
      console.log(error);
      res.status(400).send('Server error')
   }
});


// @route POST v1/orders/status/:order_id
// @desc Change Order Status
// 'waiting', 'processing', 'delivered', 'rejected'
// @access Private
router.post('/status/:order_id' , async (req, res) => {

    const {
        order_status
    } = req.body;

    if(!order_status) return res.status(400).send('Select Status')

    try {
        
        const order = await Order.findOne({
            order_id : req.params.order_id
        })
        
       if (!order) return res.status(404).send('Order not found!');

       await Order.update({order_status}, {where : {order_id : req.params.order_id}});
        
        return res.send(`Order Status Changed to ' ${order_status} '`)
 
    } catch (error) {
       console.log(error);
       res.status(400).send('Server error')
    }
});

module.exports = router;
