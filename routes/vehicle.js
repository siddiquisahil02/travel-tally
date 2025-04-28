const express = require("express");
const router = express.Router();
const VehicleModel = require("../model/vehicleModel")
const {vehicleRegisterValidate} = require("../utils/validation");
const CorpModel = require("../model/corpModel");

router.post("/register",async function (req, res) {
    console.log("Hitting Vehicle Register")
    try {
        const { error } = vehicleRegisterValidate.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const corp = await CorpModel.findOne({userId:req.userId})
        if(!corp){
            return res.status(400).json({ message: "Corp not found" });
        }

        const vehicle = new VehicleModel({
            userId: req.userId,
            corpId: corp._id,
            model: req.body.model,
            color: req.body.color,
            year: req.body.year,
            registrationNumber: req.body.registrationNumber,
            totalKms: req.body.totalKms,
            mileage: req.body.mileage
        });
        
        const vehicleRecord = await vehicle.save();
        return res.status(201).json({ vehicleRecordId: vehicleRecord._id, message: "Vehicle registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Vehicle" });
    }
});

router.get("/getAll",async function (req, res) {
    console.log("Hitting Get All Vehicles")
    try {
    const vehicleRecords = await VehicleModel.find()
    return res.status(200).send({status: true, length: vehicleRecords.length,vehicleRecords});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all the Vehicles" });
    }
});
module.exports = router;
