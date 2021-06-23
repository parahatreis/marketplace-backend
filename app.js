const express = require('express');
const http = require('http');
const { sequelize } = require('./models');
const path = require('path');
const cors = require('cors')
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server, { 
   allowEIO3: true,
   cors : {
      origin : ["http://localhost:5050","http://localhost:3000"]
   }
});

// Init Middleware
app.use(express.json({
   extended: false
}));

app.use(cors()) // Use this after the variable declaration

app.get('/', (req, res) => {
   res.send('SM APIs Running!')
});

// root path
app.use(express.static(path.join(__dirname, 'public')));


// Define Routes
app.use('/v1/categories', require('./routes/v1/categories'));
app.use('/v1/subcategories', require('./routes/v1/subcategories'));
app.use('/v1/brands', require('./routes/v1/brands'));
app.use('/v1/admins', require('./routes/v1/admins'));
app.use('/v1/stores', require('./routes/v1/stores'));
app.use('/v1/store_admins', require('./routes/v1/store_admins'));
app.use('/v1/products', require('./routes/v1/products'));
app.use('/v1/banners', require('./routes/v1/banners'));
app.use('/v1/home_subcategories', require('./routes/v1/home'));
app.use('/v1/users', require('./routes/v1/users'));
app.use('/v1/orders', require('./routes/v1/orders'));
app.use('/v1/currency', require('./routes/v1/currency'));
// Sizes Stocks
app.use('/v1/size_types', require('./routes/v1/size_types'));


// Connect to socket
io.on('connection', (socket) => {
  console.log('Connected', socket.id);

  socket.on("verify-code", (data) => {
      if(data.user_phone){  
          const generated_code = Math.floor(100000 + Math.random() * 900000);
          socket.broadcast.emit("send-code", {
              ...data,
              code : generated_code
          })
      }
  });
  
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
});



// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
   console.log(`Server started on ${PORT}`);
   // Sync database
   // to update model in db .sync({force : false})
   await sequelize.authenticate();
   console.log('Database Connected')
});

