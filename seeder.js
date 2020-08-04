const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('dotenv')

//load env vars
dotenv.config({ path: './config/config.env' })

//load models
const Business = require('./models/Business')

//Connect to DB
