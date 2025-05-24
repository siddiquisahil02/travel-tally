const express = require("express");
const router = express.Router();
const { serviceRecordValidate } = require("../utils/validation");
const CorpModel = require("../model/corpModel");
const ServiceRecordModel = require("../model/serviceRecords")
const VehicleModel = require("../model/vehicleModel")

router.post("/create", async function (req, res) {
    console.log("Hitting Create Service Records")
    try {
        const { error } = serviceRecordValidate.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const corp = await CorpModel.findOne({ userId: req.userId })
        if (!corp) {
            return res.status(400).json({ message: "Corp not found" });
        }

        const vehicleRecord = await VehicleModel.findById(req.body.vehicleId);
        if (!vehicleRecord) {
            return res.status(400).json({ message: "Vehicle Not Found" });
        }

        const serviceRecord = new ServiceRecordModel({
            userId: req.userId,
            corpId: corp._id,
            vehicleId: req.body.vehicleId,
            serviceDate: req.body.serviceDate,
            serviceKms: req.body.serviceKms,
            servicePrice: req.body.servicePrice,
            servicedAt: req.body.servicedAt,
            partsChanged: req.body.partsChanged,
            nextServiceDate: req.body.nextServiceDate,
            notes: req.body.notes
        });

        const savedServiceRecord = await serviceRecord.save();
        return res.status(201).json({ serviceRecordId: savedServiceRecord._id, message: "Service Record Created successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating Service Record" });
    }
});

router.get("/getAll", async function (req, res) {
    console.log("Hitting Get All Service Records")
    try {
        const serviceRecords = await ServiceRecordModel
            .find({ userId: req.userId })
            .populate({
                path: "vehicleId",
                select: "model color year type fuelType registrationNumber mileage totalKms -_id"
            })
            .sort({ serviceDate: -1 });
        if (!serviceRecords) {
            return res.status(404).send({
                status: false,
                message: "Service Records not found"
            })
        }
        return res.status(200).json({ status: true, length: serviceRecords.length, serviceRecords });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all Service Records." });
    }
});

router.put("/update/:serviceRecordId", async function (req, res) {
    console.log("Hitting Update Service Record")
    try {
        const serviceRecordId = req.params.serviceRecordId;
        const serviceRecord = await ServiceRecordModel.findByIdAndUpdate(serviceRecordId, req.body, { new: true });
        if (!serviceRecord) {
            return res.status(404).json({ message: "Service Record not found" });
        }
        return res.status(200).json({ message: "Service Record updated successfully", serviceRecord });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating Service Record" });
    }
});
module.exports = router;
