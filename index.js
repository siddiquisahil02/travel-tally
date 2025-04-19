const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const port = process.env.PORT || 4500;

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

const indexRoutes = require('./routes/indexRoutes')

app.use('/api', indexRoutes)

if(process.env.ENV=="Dev"){
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}else{
  module.exports = app;
}