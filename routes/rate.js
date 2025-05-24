const express = require("express");
const router = express.Router();
const VehicleModel = require("../model/vehicleModel")
const { outstationRateValidate, localRateValidate, transferRateValidate } = require("../utils/validation");
const CorpModel = require("../model/corpModel");
const OutstationRateModel = require("../model/rates/outstationRateModel");
const LocalRateModel = require("../model/rates/localRateModel");
const TransferRateModel = require("../model/rates/transferRatesModel");
const ClientModel = require("../model/clientModel");

router.post("/register/:rateType", async function (req, res) {
    console.log("Hitting Rate register")
    try {
        const rateType = req.params.rateType;
        if (!rateType) {
            return res.status(400).json({ message: "Rate Type is required" });
        }
        const corp = await CorpModel.findOne({ userId: req.userId })
        if (!corp) {
            return res.status(400).json({ message: "Corp not found" });
        }
        if (!req.body.clientId) return res.status(400).json({ message: "Need Client ID." });
        const client = await ClientModel.findById(req.body.clientId);
        if (!client) {
            return res.status(400).json({ message: "No client found for this ID." });
        }
        let rate = null;
        if (rateType == "outstation") {
            const { error } = outstationRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const r = await OutstationRateModel.findOne({ clientId: req.body.clientId, vehicleType: req.body.vehicleType })
            if (r) {
                return res.status(400).json({ message: "Rate for this vehicle type already exisits." });
            }
            rate = new OutstationRateModel({
                ...req.body,
                corpId: corp._id,
                userId: req.userId
            })
        }
        else if (rateType == "local") {
            const { error } = localRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const r = await LocalRateModel.findOne({ clientId: req.body.clientId, vehicleType: req.body.vehicleType })
            if (r) {
                return res.status(400).json({ message: "Rate for this vehicle type already exisits." });
            }
            rate = new LocalRateModel({
                ...req.body,
                corpId: corp._id,
                userId: req.userId
            })
        }
        else if (rateType == "transfer") {
            const { error } = transferRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const r = await TransferRateModel.findOne({ clientId: req.body.clientId, vehicleType: req.body.vehicleType })
            if (r) {
                return res.status(400).json({ message: "Rate for this vehicle type already exisits." });
            }
            rate = new TransferRateModel({
                ...req.body,
                corpId: corp._id,
                userId: req.userId
            })
        }
        else {
            return res.status(400).json({ message: "Invalid Rate Type" });
        }

        const rateRecord = await rate.save();
        return res.status(201).json({ rateRecordId: rateRecord._id, message: "Rate registered successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Vehicle" });
    }
}
);

router.get("/get/:clientId", async function (req, res) {
    console.log("Hitting Rate get")
    try {
        const clientId = req.params.clientId;
        if (!clientId) {
            return res.status(400).json({ message: "Client ID is required" });
        }
        const outstationRate = await OutstationRateModel.find({ clientId: clientId }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const localRate = await LocalRateModel.find({ clientId: clientId }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const transferRate = await TransferRateModel.find({ clientId: clientId }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const rate = {
            outstationRate: outstationRate,
            localRate: localRate,
            transferRate: transferRate
        }
        if (rate.outstationRate.length == 0 && rate.localRate.length == 0 && rate.transferRate.length == 0) {
            return res.status(400).json({ message: "No Rates found" });
        }
        return res.status(200).json({ rateRecords: rate });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error getting Rates" });
    }
});

router.get("/get/:clientId/:vehicleType", async function (req, res) {
    console.log("Hitting Rate get and type")
    try {
        const clientId = req.params.clientId;
        const vehicleType = req.params.vehicleType;
        if (!clientId || !vehicleType) {
            return res.status(400).json({ message: "Client ID and Vehicle Type is required" });
        }
        if (!['Hatchbacks', 'Sedan', 'SUV', 'Compact-SUV', 'MPV', 'EV', 'Traveller', 'Bus', 'Pickup', 'Mini-Bus'].includes(vehicleType)) {
            return res.status(400).json({ message: "Invalid Vehicle Type" });
        }

        const outstationRate = await OutstationRateModel.find({ clientId: clientId, vehicleType: vehicleType }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const localRate = await LocalRateModel.find({ clientId: clientId, vehicleType: vehicleType }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        const transferRate = await TransferRateModel.find({ clientId: clientId, vehicleType: vehicleType }, "-_id -__v -corpId -userId -clientId -createdAt -updatedAt");
        //const rate = [...outstationRate, ...localRate, ...transferRate];
        // if(rate.length==0){
        //     return res.status(400).json({ message: "No Rates found" });
        // }
        return res.status(200).send({ outstationRate, localRate, transferRate });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error getting Rates" });
    }
});

router.delete("/delete/:rateType/:clientId/:vehicleType", async function (req, res) {
    console.log("Hitting Rate delete")
    try {
        const clientId = req.params.clientId;
        const vehicleType = req.params.vehicleType;
        const rateType = req.params.rateType;
        if (!rateType || !clientId || !vehicleType) {
            return res.status(400).json({ message: "Rate Type, Client ID and Vehicle Type is required" });
        }
        if (!['Hatchbacks', 'Sedan', 'SUV', 'Compact-SUV', 'MPV', 'EV', 'Traveller', 'Bus', 'Pickup', 'Mini-Bus'].includes(vehicleType)) {
            return res.status(400).json({ message: "Invalid Vehicle Type" });
        }
        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(400).json({ message: "No client found for this ID." });
        }
        let r = null;
        if (rateType == "outstation") {
            r = await OutstationRateModel.findOneAndDelete({ clientId: clientId, vehicleType: vehicleType })
        }
        else if (rateType == "local") {
            r = await LocalRateModel.findOneAndDelete({ clientId: clientId, vehicleType: vehicleType })
        }
        else if (rateType == "transfer") {
            r = await TransferRateModel.findOneAndDelete({ clientId: clientId, vehicleType: vehicleType })
        }
        else {
            return res.status(400).json({ message: "Invalid Rate Type" });
        }
        return r != null ? res.status(200).json({ message: "Rate Deleted succesfully." }) : res.status(404).json({ message: "Rate Not Found." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error getting Rates" });
    }
});

router.put("/update/:rateType", async function (req, res) {
    console.log("Hitting update Rate")
    try {
        const rateType = req.params.rateType;
        if (!rateType) {
            return res.status(400).json({ message: "Rate Type is required" });
        }
        const corp = await CorpModel.findOne({ userId: req.userId })
        if (!corp) {
            return res.status(400).json({ message: "Corp not found" });
        }
        if (!req.body.clientId) return res.status(400).json({ message: "Need Client ID." });
        const client = await ClientModel.findById(req.body.clientId);
        if (!client) {
            return res.status(400).json({ message: "No client found for this ID." });
        }
        let rate = null;
        if (rateType == "outstation") {
            const { error } = outstationRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = await OutstationRateModel.findOneAndUpdate({ clientId: req.body.clientId, vehicleType: req.body.vehicleType }, req.body, { new: true })
        }
        else if (rateType == "local") {
            const { error } = localRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = await LocalRateModel.findOneAndUpdate({ clientId: req.body.clientId, vehicleType: req.body.vehicleType }, req.body, { new: true })
        }
        else if (rateType == "transfer") {
            const { error } = transferRateValidate.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            rate = await TransferRateModel.findOneAndUpdate({ clientId: req.body.clientId, vehicleType: req.body.vehicleType }, req.body, { new: true })
        }
        else {
            return res.status(400).json({ message: "Invalid Rate Type" });
        }
        if (rate==null) {
            return res.status(404).json({ message: "Rate Not Found." })
        } else {
            return res.status(200).json({ message: "Rate updated successfully", rate });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Vehicle" });
    }
}
);

module.exports = router;