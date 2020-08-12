const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const xss = require('xss-clean')
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
const reviews = require('./routes/reviews')

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

//Sanitize data
app.use(mongoSanitize())

//Enable security headers
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10mins
  max: 100,
})

app.use(limiter)

//Http param pollution
app.use(hpp())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/businesses', businesses)
app.use('/api/v1/services', services)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

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
