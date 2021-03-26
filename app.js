const express = require('express');
const { sequelize } = require('./models');


const app = express();
// Init Middleware
app.use(express.json({
   extended: false
}));


app.get('/', (req, res) => {
   res.send('SM APIs Running!')
});


// Define Routes
app.use('/v1/categories', require('./routes/v1/categories'));
app.use('/v1/subcategories', require('./routes/v1/subcategories'));
app.use('/v1/brands', require('./routes/v1/brands'));
app.use('/v1/admins', require('./routes/v1/admins'));
app.use('/v1/stores', require('./routes/v1/stores'));
app.use('/v1/store_admins', require('./routes/v1/store_admins'));
app.use('/v1/products', require('./routes/v1/products'));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
   console.log(`Server started on ${PORT}`);
   // Sync database 
   await sequelize.authenticate();
   console.log('Database Connected')
});