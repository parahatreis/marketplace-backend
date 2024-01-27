const express = require('express')
const dotenv = require('dotenv')
const http = require('http')
const path = require('path')
const cors = require('cors')
// 
const { sequelize } = require('./models')
const apiRoutes = require('./routes/v1');

const app = express()
const server = http.createServer(app)
dotenv.config()

/* Middlewares */
// JSON
app.use(
  express.json({
    extended: false,
  })
)
// CORS
app.use(cors())
// root path
app.use(express.static(path.join(__dirname, 'public')))

// Define Routes
app.use('/v1', apiRoutes);

// Start Server
const PORT = process.env.PORT || 5000
server.listen(PORT, async () => {
  console.log(`Server started on ${PORT}`)
  // Sync database
  // to update model in db .sync({force : false})
  await sequelize.authenticate()
  console.log('Database Connected')
})
