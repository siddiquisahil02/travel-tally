const { required } = require("joi");
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    corpId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Corp"},
    userId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    model : { type: String, required: true},
    color : { type: String, required: true},
    year : { type: String, required: true},
    registrationNumber : { type: String, required : true, unique: true},
    totalKms : { type: Number, required: true},
    mileage : {type: Number, required: false}
},{timestamps:true});

module.exports = mongoose.model("Vehicle",vehicleSchema);