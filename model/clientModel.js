const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    clientName: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    corpId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'Corp'},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: String, required: true},
    gstin: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true}

},{timestamps:true});

const ClientModel = mongoose.model("client", ClientSchema);

module.exports = ClientModel;