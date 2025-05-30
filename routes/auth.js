const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UsersModel = require("../model/userModel");
const { sendVerificationCode,verifyCode } = require("../utils/twilioVerify");
const { userValidate,loginValidate,forgetPasswordVerifyValidate,forgotPasswordValidate } = require("../utils/validation");
const jwt = require('jsonwebtoken');


router.post("/register",async function (req, res) {
    console.log("Hitting the resigter User")
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
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '6h',
        });
        return res.status(201).json({ userId: savedUser._id, message: "User registered successfully", token:token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering user" });
    }
});

router.post("/verify", async function (req, res) {
    console.log("Hitting the verify User")
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ message: "Phone number and code are required" });
    }

    try {
        const verificationResult = await verifyCode(phone, code);
        if (verificationResult.status === "approved") {
            await UsersModel.updateOne({ phone }, { phoneVerified: true });
            return res.status(200).json({ message: "Phone number verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error verifying code" });
    }
}
);

router.post("/login", async function (req, res) {
    console.log("Hitting the Login User")
    try{
        const { error } = loginValidate.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = await UsersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '12h',
        });

        return res.status(200).json({ message: "Login successful", userId: user._id,token:token });
    }catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error during signing user" });
    }
});

router.post("/forgetPassword",async function (req,res){
    console.log("Hitting the forgot password")
    try{
        const { error } = forgotPasswordValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
        const {email} = req.body;
    const user = await UsersModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email not registered" });
    }

    if(user.phoneVerified){
        const verification = sendVerificationCode(user.phone);
        if (!verification) {
            return res.status(500).json({ message: "Error sending verification code" });
        }
        return res.status(200).json({ message: "OTP sent to the registered number" });
    }else{
        return res.status(400).json({ message: "Phone number not verified" });
    }   
    }catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering user" });
    }
})

router.post("/forgetPasswordVerify",async function (req,res){
    console.log("Hitting the forgot password verify")
    try{
        const { error } = forgetPasswordVerifyValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
        const {email, code, newPassword} = req.body;
    const user = await UsersModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email not registered" });
    }

    const verificationResult = await verifyCode(user.phone, code);

    if (verificationResult.status === "approved") {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: "Password Changed successfuly" });
    } else {
        return res.status(400).json({ message: "Invalid verification code" });
    }
    }catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error in this operation ${err}` });
    }
})

module.exports = router;
