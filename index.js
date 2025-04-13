const express = require('express')
const app = express()
const mongoose = require('mongoose')
const serverless = require('serverless-http');
// const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

const indexRoutes = require('./routes/indexRoutes')

app.use('/api', indexRoutes)

if(process.env.ENV=="Dev"){
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })
}else{
  module.exports.handler = serverless(app);
}