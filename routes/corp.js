const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UsersModel = require("../model/users");
const CorpModel = require("../model/corp")
const { corpRegisterValidate } = require("../utils/validation");
const jwt = require('jsonwebtoken');


router.post("/register",async function (req, res) {
    const { error } = corpRegisterValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const corp = new CorpModel({
        corpName: req.body.corpName,
        userId: req.userId,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gstin: req.body.gstin
        
    });
    
    
    try {
        const corpRecord = await corp.save();
        return res.status(201).json({ corpRecordID: corpRecord._id, message: "Corp registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Corp" });
    }
});
router.get("/getAll",async function (req, res) {
    try {
    const corpRecords = await CorpModel.find({userId:req.userId})
    let finalData = []
    corpRecords.forEach((e)=>{
        //console.log(e.toJSON())
        finalData.push(e.toJSON())
    })
        return res.status(200).json({found:finalData.length,data:finalData});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all the Corp" });
    }
});
module.exports = router;
