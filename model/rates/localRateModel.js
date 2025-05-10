const mongoose = require("mongoose");

const localRateSchema = new mongoose.Schema({
    corpId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Corp" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Client" },
    vehicleType: { type: String, enum: ['Hatchbacks', 'Sedan', 'SUV', 'Compact-SUV', 'MPV', 'EV', 'Traveller', 'Bus', 'Pickup', 'Mini-Bus'], required: true },
    rate:{ type: Number, required: true },
    maxKms: { type: Number, required: true },
    maxhours: { type: Number, required: true },
    extraHourRate: { type: Number, required: false },
}, { timestamps: true });

module.exports = mongoose.model("LocalRate", localRateSchema);