const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CorpSchema = new Schema({
    corpName: { type: String, required: true },
    userId: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: String, required: true},
    gstin: {type: String, required: true},
    altPhone: {type: String, required: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
});

// Compile model from schema
const CorpModel = mongoose.model("Corp", CorpSchema);

module.exports = CorpModel;