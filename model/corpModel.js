const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CorpSchema = new Schema({
    corpName: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: String, required: true},
    gstin: {type: String, required: true},
    phone: {type: String, required: true},
    altPhone: {type: String, required: false}
},{timestamps:true});

const CorpModel = mongoose.model("Corp", CorpSchema);

module.exports = CorpModel;