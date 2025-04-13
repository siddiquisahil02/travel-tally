const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UsersModel = require("../model/users");
const { sendVerificationCode,verifyCode } = require("../utils/twilioVerify");
const { userValidate } = require("../utils/validation");


router.post("/register",async function (req, res) {
    const { error } = userValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await UsersModel.findOne({
        $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UsersModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
    });
    
    const verification = sendVerificationCode(req.body.phone);
    if (!verification) {
        return res.status(500).json({ message: "Error sending verification code" });
    }
    try {
        const savedUser = await user.save();
        res.status(201).json({ userId: savedUser._id, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

router.post("/verify", async function (req, res) {
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ message: "Phone number and code are required" });
    }

    try {
        const verificationResult = await verifyCode(phone, code);
        if (verificationResult.status === "approved") {
            await UsersModel.updateOne({ phone }, { phoneVerified: true });
            res.status(200).json({ message: "Phone number verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error verifying code" });
    }
}
);

router.post("/login", async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UsersModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
});

module.exports = router;
