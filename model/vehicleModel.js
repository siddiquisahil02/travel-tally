const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    corpId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Corp"},
    userId : { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    model : { type: String, required: true},
    color : { type: String, required: true},
    year : { type: String, required: true},
    type : { type: String,enum: ['Hatchbacks', 'Sedan', 'SUV', 'Compact-SUV', 'MPV', 'EV','Traveller', 'Bus','Pickup','Mini-Bus'], required: true}, 
    fuelType : { type: String, enum: ['Diesel', 'Petrol', 'Petrol/CNG','EV'], required: true},
    note: { type: String, required: false},
    isCommercial : { type: Boolean, default: false, required: true},
    permitExpiry : { type: Date, required: false},
    fitnessExpiry : { type: Date, required: false},
    insuranceExpiry : { type: Date, required: false},
    pollutionExpiry : { type: Date, required: false},
    lastServiceDate : { type: Date, required: false},
    registrationNumber : { type: String, required : true, unique: true},
    totalKms : { type: Number, required: true},
    mileage : {type: Number, required: false}
},{timestamps:true});

const VehicleModel = mongoose.model("Vehicle",vehicleSchema);

module.exports = VehicleModel