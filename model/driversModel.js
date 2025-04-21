const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    aadhar:{
        type: String,
        required: false
    },
    license:{
        type: String,
        required: false
    },
    address:{
        type: String,
        required: true
    },
    joiningDate:{
        type: Date,
        required: true
    }
}, {timestamps:true})

module.exports = mongoose.model("Drivers", driverSchema)