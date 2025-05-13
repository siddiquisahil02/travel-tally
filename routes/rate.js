const express = require("express");
const router = express.Router();
const VehicleModel = require("../model/vehicleModel")
const {outstationRateValidate,localRateValidate,transferRateValidate} = require("../utils/validation");
const CorpModel = require("../model/corpModel");
const OutstationRateModel = require("../model/rates/outstationRateModel");
const LocalRateModel = require("../model/rates/localRateModel");
const TransferRateModel = require("../model/rates/transferRatesModel");

router.post("/register/:rateType",async function (req, res) {
    console.log("Hitting Rate register")
    try {
        const rateType = req.params.rateType;
        if(!rateType){
            return res.status(400).json({ message: "Rate Type is required" });
        }
        const corp = await CorpModel.findOne({userId:req.userId})
        if(!corp){
            return res.status(400).json({ message: "Corp not found" });
        }
        let rate = null;
        if(rateType=="outstation"){
            const {error} = outstationRateValidate.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = new OutstationRateModel({
                ...req.body,
                corpId:corp._id,
                userId:req.userId
            })
        }
        else if(rateType=="local"){
            const {error} = localRateValidate.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = new LocalRateModel({
                ...req.body,
                corpId:corp._id,
                userId:req.userId
            })
        }
        else if(rateType=="transfer"){
            const {error} = transferRateValidate.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = new TransferRateModel({
                ...req.body,
                corpId:corp._id,
                userId:req.userId
            })
        }
        else{
            return res.status(400).json({ message: "Invalid Rate Type" });
        }

        const rateRecord = await rate.save();
        return res.status(201).json({ rateRecordId: rateRecord._id, message: "Rate registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Vehicle" });
    }
}
);

router.get("/get/:clientId",async function (req, res) {
    console.log("Hitting Rate get")
    try {
        const clientId = req.params.clientId;
        if(!clientId){
            return res.status(400).json({ message: "Client ID is required" });
        }
        const outstationRate = await OutstationRateModel.find({clientId:clientId},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const localRate = await LocalRateModel.find({clientId:clientId},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const transferRate = await TransferRateModel.find({clientId:clientId},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const rate = {
            outstationRate: outstationRate,
            localRate: localRate,
            transferRate: transferRate
        }
        if(rate.outstationRate.length==0 && rate.localRate.length==0 && rate.transferRate.length==0){
            return res.status(400).json({ message: "No Rates found" });
        }
        return res.status(200).json({ rateRecords: rate});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error getting Rates" });
    }
});

router.get("/get/:clientId/:vehicleType",async function (req, res) {
    console.log("Hitting Rate get and type")
    try {
        const clientId = req.params.clientId;
        const vehicleType = req.params.vehicleType;
        if(!clientId || !vehicleType){
            return res.status(400).json({ message: "Client ID and Vehicle Type is required" });
        }
        if(!['Hatchbacks', 'Sedan', 'SUV', 'Compact-SUV', 'MPV', 'EV', 'Traveller', 'Bus', 'Pickup', 'Mini-Bus'].includes(vehicleType)) {
            return res.status(400).json({ message: "Invalid Vehicle Type" });
        }

        const outstationRate = await OutstationRateModel.find({clientId:clientId,vehicleType:vehicleType},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const localRate = await LocalRateModel.find({clientId:clientId,vehicleType:vehicleType},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const transferRate = await TransferRateModel.find({clientId:clientId,vehicleType:vehicleType},"-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        //const rate = [...outstationRate, ...localRate, ...transferRate];
        // if(rate.length==0){
        //     return res.status(400).json({ message: "No Rates found" });
        // }
        return res.status(200).send({ outstationRate,localRate,transferRate });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error getting Rates" });
    }
});

module.exports = router;