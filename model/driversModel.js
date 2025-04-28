const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    corpId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Corp"},
    userId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
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
        required: true,
        unique: true
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

module.exports = mongoose.model("Driver", driverSchema)