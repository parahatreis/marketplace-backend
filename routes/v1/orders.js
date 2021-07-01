const express = require('express');
const router = express.Router();
// Models
const { Order , OrderProduct, Product, User, Stock, Store,SizeName, Brand, SizeType } = require('../../models');
// auth
const userAuth = require('../../middleware/userAuth');

// @route POST v1/orders
// @desc Order Products
// @access Public(Auth User)
router.post('/' , async (req, res) => {

    let total_price = 0;
    let hasEnaughQuantity = true;
    let user = null;

    const {
        products,
        user_name,
        user_phone,
        user_address,
        user_note,
        user_id,
    } = req.body;


    if(!products) return res.status(400).send('Please Choose Products')
    if(products.length === 0) return res.status(400).send('Please Choose Products');
    if(!user_name) return res.status(400).send('Input name');
    if(!user_phone) return res.status(400).send('Input phone');
    if(!user_address) return res.status(400).send('Input address');

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

        // Create ORDER
        async function createOrder(){
            
            if(user_id){
                // Get auth user Info
                user = await User.findOne({
                    where: {
                        user_id
                    }
                });
            }

            const order = await Order.create({
                userId : user ? user.id : null,
                userAuth : user ? true : false,
                user_name : user ? user.user_name : user_name,
                user_phone : user ? user.user_phone : user_phone,
                user_address : user ? user.user_address : user_address,
                user_note,
                payment_type : req.body.payment_type
            })

            await products.forEach(async (val, index) => {
                // Find Product
                const product = await Product.findOne({where : {product_id : val.product_id}});
                // Find Stock
                const stock = await Stock.findOne({ where: { stock_id: val.stock_id } });
                    
                await OrderProduct.create({
                    productId : product.id,
                    product_code: product.product_code,
                    product_name_tm: product.product_name_tm,
                    product_name_ru: product.product_name_ru,
                    product_name_en: product.product_name_en,
                    orderId : order.id,
                    sold_price : product.price,
                    sizeNameId: stock.sizeNameId,
                    quantity: val.quantity,
                });

                // Mukdar sany azalya
                stock.stock_quantity = Number(stock.stock_quantity) - val.quantity
                stock.save()
                
                total_price = total_price + (product.price * val.quantity);
                
                if(index === products.length - 1){
                    order.subtotal = total_price;
                    await order.save();
                    return res.status(200).json({msg : 'Sargyt ugradyldy!'})
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
   let isChanged = false;

    const {
        products,
    } = req.body;

    console.log(req.body)

   

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
            const findProduct = await Product.findOne({
                where: {
                   product_id: product.product_id
                },
                include : [
                  {
                      model : Brand,
                      as : 'brand',
                      attributes : ['brand_id','brand_name']
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
            // Check product has more quantity than database exists, if true then refactor quantity 
            if (findStock.stock_quantity < product.quantity) {
                isChanged = true;
                if(findStock.sizeName){
                    lessStockProducts = [
                        ...lessStockProducts,
                        {
                            ...findProduct.dataValues,
                            quantity : findStock.stock_quantity,
                            sizeNameId : findStock.sizeName.size_name_id
                        }
                    ]
                }
                else{
                    lessStockProducts = [
                        ...lessStockProducts, 
                        {
                            ...findProduct.dataValues,
                            quantity : findStock.stock_quantity,
                        }
                    ]
                }
            }
            else{
                if(findStock.sizeName){
                    lessStockProducts = [
                        ...lessStockProducts,
                        {
                            ...findProduct.dataValues,
                            quantity : product.quantity,
                            sizeNameId : findStock.sizeName.size_name_id
                        }
                    ]
                }
                else{
                    lessStockProducts = [
                        ...lessStockProducts,
                        {
                            ...findProduct.dataValues,
                            quantity : product.quantity,
                        }
                    ]
                }
            }
            if(index === products.length - 1){
                lessStockProducts = lessStockProducts.filter(prod => prod.quantity > 0);
                return res.json({products : lessStockProducts,isChanged})
            }
        });

        

    } catch (error) {
        console.error(error);
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
