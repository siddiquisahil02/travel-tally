const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceRecordSchema = new Schema({
    corpId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Corp" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Vehicle" },
    serviceDate : { type: Date, required: true },
    serviceKms : { type: Number, required: true },
    servicedAt: { type: String, required: false },
    servicePrice : { type: Number, required: true},
    partsChanged : { type:  String, required: false},
    nextServiceDate : { type: Date, required: true},
    notes : { type: String, required: false}
}, { timestamps: true });

const ServiceRecordModel = mongoose.model("ServiceRecord", ServiceRecordSchema);

module.exports = ServiceRecordModel;