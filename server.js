const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//load env vars
dotenv.config({ path: './config/config.env' })

//Connect to database
connectDB()

//Route files
const businesses = require('./routes/businesses')
const services = require('./routes/services')
const auth = require('./routes/auth')
const users = require('./routes/users')

const app = express()

//Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())

//dev log middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//File uploading
app.use(fileupload())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/businesses', businesses)
app.use('/api/v1/services', services)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  //Close server and exit process
  server.close(() => process.exit(1))
})
