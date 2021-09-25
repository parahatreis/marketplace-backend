const express = require('express');
const router = express.Router();
// Models
const {
	Order,
	OrderProduct,
	Product,
	User,
	Stock,
	Store,
	SizeName,
	Brand,
	SizeType,
	StoreAdmin
} = require('../../models');
// auth
const userAuth = require('../../middleware/userAuth');
const storeAdminAuth = require('../../middleware/storeAdminAuth');
const adminAuth = require("../../middleware/adminAuth");


// @route POST v1/orders
// @desc Order Products
// @access Public(Auth User)
router.post('/', async (req, res) => {

	let total_price = 0;
	let user = null;

	const {
		products,
		user_name,
		user_phone,
		user_address,
		user_note,
		user_id,
	} = req.body;


	if (!products) return res.status(400).send('Please Choose Products')
	if (products.length === 0) return res.status(400).send('Please Choose Products');
	if (!user_name) return res.status(400).send('Input name');
	if (!user_phone) return res.status(400).send('Input phone');
	if (!user_address) return res.status(400).send('Input address');

	try {

		for (const val of products) {
			const findStock = await Stock.findOne({
				where: {
					stock_id: val.stock_id
				}
			});

			if (findStock.stock_quantity < val.quantity) {
				return res.status(400).json({
					msg: 'Ýeterlikli haryt mukdary ýok!'
				});
			}
		}

		// Create ORDER
		if (user_id) {
			// Get auth user Info
			user = await User.findOne({
				where: {
					user_id
				}
			});
		}

		const order = await Order.create({
			userId: user ? user.id : null,
			userAuth: user ? true : false,
			user_name: user ? user.user_name : user_name,
			user_phone: user ? user.user_phone : user_phone,
			user_address: user && user.user_address ? user.user_address : user_address,
			user_note,
			payment_type: req.body.payment_type
		})

		for (const val of products) {
			// Find Product
			const product = await Product.findOne({
				where: {
					product_id: val.product_id
				}
			});
			if (!product) return res.status(404).json({
				msg: 'Stock Not found'
			})
			// Find Stock
			const stock = await Stock.findOne({
				where: {
					stock_id: val.stock_id
				}
			});
			if (!stock) return res.status(404).json({
				msg: 'Stock Not found'
			})

			await OrderProduct.create({
				productId: product.id,
				product_code: product.product_code,
				product_name_tm: product.product_name_tm,
				product_name_ru: product.product_name_ru,
				product_name_en: product.product_name_en,
				orderId: order.id,
				sold_price: product.price,
				sizeNameId: stock.sizeNameId,
				quantity: val.quantity,
			});

			// Mukdar sany azalya
			stock.stock_quantity = Number(stock.stock_quantity) - val.quantity
			stock.save()

			total_price = total_price + (product.price * val.quantity);

			order.subtotal = total_price;
			await order.save();
			return res.status(200).json({
				msg: 'Sargyt ugradyldy!'
			})
		}


	} catch (error) {
		console.log(error);
		return res.status(400).send('Server error')
	}
});


// @route POST v1/orders/check-stocks
// @desc Check Product Stocks
// @access Public
router.post('/check-stocks', async (req, res) => {

	let lessStockProducts = [];
	let isChanged = false;

	const {
		products,
	} = req.body;

	if (!products) return res.status(400).json({
		msg: 'Please Choose Products'
	});
	if (products.length === 0) return res.status(400).json({
		msg: 'Products List length must be bigger than 0'
	});

	try {

		// Check stock quantity
		for (const product of products) {

			// Validation
			if (!product.quantity) return res.status(400).json({
				msg: "Select product quantity"
			});
			if (!product.stock_id) return res.status(400).json({
				msg: "Select product stock_id"
			});
			if (!product.product_id) return res.status(400).json({
				msg: "Select product product_id"
			});

			const findStock = await Stock.findOne({
				where: {
					stock_id: product.stock_id
				},
				include: {
					model: SizeName,
					as: 'sizeName'
				}
			});
			if (!findStock) return res.status(404).json({
				msg: "Stock Not found"
			});
			const findProduct = await Product.findOne({
				where: {
					product_id: product.product_id
				},
				attributes: {
					exclude: ['price_usd', 'price_tmt', 'old_price_usd', 'old_price_tmt', 'isPriceUsd']
				},
				include: [{
						model: Brand,
						as: 'brand',
						attributes: ['brand_id', 'brand_name']
					},
					{
						model: Stock,
						as: 'stocks',
						include: [{
								model: SizeName,
								as: 'sizeName',
							},
							{
								model: SizeType,
								as: 'sizeType',
							}
						]
					}
				]
			});
			if (!findProduct) return res.status(404).json({
				msg: "Product Not found"
			})

			// Check product has more quantity than database exists, if true then refactor quantity
			if (findStock.stock_quantity < product.quantity) {
				isChanged = true;
				if (findStock.sizeName) {
					lessStockProducts = [
						...lessStockProducts,
						{
							...findProduct.dataValues,
							quantity: findStock.stock_quantity,
							sizeNameId: findStock.sizeName.size_name_id
						}
					]
				} else {
					lessStockProducts = [
						...lessStockProducts,
						{
							...findProduct.dataValues,
							quantity: findStock.stock_quantity,
						}
					]
				}
			} else {
				if (findStock.sizeName) {
					lessStockProducts = [
						...lessStockProducts,
						{
							...findProduct.dataValues,
							quantity: product.quantity,
							sizeNameId: findStock.sizeName.size_name_id
						}
					]
				} else {
					lessStockProducts = [
						...lessStockProducts,
						{
							...findProduct.dataValues,
							quantity: product.quantity,
						}
					]
				}
			}
		}

		lessStockProducts = lessStockProducts.filter(prod => prod.quantity > 0);
		return res.json({
			products: lessStockProducts,
			isChanged
		})


	} catch (error) {
		console.error(error);
		res.status(400).send('Server error')
	}
});



// @route GET v1/orders
// @desc Get all orders
// @access Private
router.get('/',adminAuth, async (req, res) => {

	try {

		const orders = await Order.findAll({
			order: [
				['createdAt', 'DESC']
			],
			include: [{
					model: OrderProduct,
					as: 'order_products',
					include: [{
						model: Product,
						as: 'product',
						attributes: ['product_id', 'product_name_tm', 'product_name_ru', 'product_name_en']
					}]
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
router.get('/store/number', storeAdminAuth, async (req, res) => {

	try {
		const storeAdmin = await StoreAdmin.findOne({
			where: {
				store_admin_id : req.store_admin.id
			}
		})
		// const orders = await Order.findAndCountAll({
		// 	order: [
		// 		['createdAt', 'DESC']
		// 	],
		// 	where : {}
		// });

		return res.json(storeAdmin)

	} catch (error) {
		console.log(error);
		res.status(400).send('Server error')
	}
});

// @route GET v1/orders
// @desc Get all orders
// @access Private
router.get('/user', userAuth, async (req, res) => {

	try {

		// Get auth user
		const user = await User.findOne({
			where: {
				user_id: req.user.id
			}
		});

		const orders = await Order.findAll({
			order: [
				['createdAt', 'DESC']
			],
			include: [{
					model: OrderProduct,
					as: 'order_products',
					include: [{
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
			where: {
				userId: user.id
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
router.get('/:order_id', async (req, res) => {

	try {

		const orders = await Order.findOne({
			where: {
				order_id: req.params.order_id
			},
			include: [{
					model: OrderProduct,
					as: 'order_products',
					include: [{
							model: Product,
							as: 'product',
							include: [{
								model: Store,
								as: 'store'
							}]
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
router.post('/status/:order_id', adminAuth, async (req, res) => {

	const {
		order_status
	} = req.body;

	if (order_status === null) return res.status(400).send('Select Status');
	const validStatus = order_status >= 0 && order_status <= 3;
	if (!validStatus) return res.status(400).send('Select Valid Status');

	try {

		const order = await Order.findOne({
			order_id: req.params.order_id
		})

		if (!order) return res.status(404).send('Order not found!');

		await Order.update({
			order_status
		}, {
			where: {
				order_id: req.params.order_id
			}
		});

		return res.send(`Order Status Changed to ' ${order_status} '`)

	} catch (error) {
		console.log(error);
		res.status(400).send('Server error')
	}
});

module.exports = router;