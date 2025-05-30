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

        const existingUser = await VehicleModel.findOne({ registrationNumber: req.body.registrationNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Vehicle Already registered" });
        }

        const vehicle = new VehicleModel({
            userId: req.userId,
            corpId: corp._id,
            model: req.body.model,
            type: req.body.type,
            fuelType: req.body.fuelType,
            note: req.body.note,
            insuranceExpiry: req.body.insuranceExpiry,
            pollutionExpiry: req.body.pollutionExpiry,
            lastServiceDate: req.body.lastServiceDate,
            fitnessExpiry: req.body.fitnessExpiry,
            permitExpiry: req.body.permitExpiry,
            isCommercial: req.body.isCommercial,
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
    const vehicleRecords = await VehicleModel.find({userId:req.userId})
        if(!vehicleRecords){
            return res.status(500).send({
                status: false,
                message: "Vehicle Details not found"
            }) 
        }
    return res.status(200).send({status: true, length: vehicleRecords.length,vehicleRecords});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all the Vehicles" });
    }
});

router.put("/update/:vehicleId",async function (req, res) {
    console.log("Hitting Update Vehicle")
    try {
        const vehicleId = req.params.vehicleId;
        const vehicle = await VehicleModel.findByIdAndUpdate(vehicleId, req.body, { new: true });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return res.status(200).json({ message: "Vehicle updated successfully", vehicle });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating Vehicle" });
    }
});
router.delete("/delete/:vehicleId",async function (req, res) {
    console.log("Hitting Delete Vehicle")
    try {
        const vehicleId = req.params.vehicleId;
        const vehicle = await VehicleModel.findByIdAndDelete(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting Vehicle" });
    }
});
module.exports = router;
