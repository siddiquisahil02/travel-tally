const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    clientName: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    corpId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Corp'},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: String, required: true},
    gstin: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false}

},{timestamps:true});

const ClientModel = mongoose.model("client", ClientSchema);

module.exports = ClientModel;