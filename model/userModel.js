const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    phoneVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    profilePicture: { type: String, default: null },
    role : { type: String, enum: ["user", "admin"], default: "user" },
    subscriptionStartDate: { type: Date, default: null },
    subscriptionEndDate: { type: Date, default: null },
    subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },
    subscriptionType: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
},{timestamps:true});

const UsersModel = mongoose.model("User", UserSchema);

module.exports = UsersModel;