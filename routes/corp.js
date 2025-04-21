const express = require("express");
const router = express.Router();
const UsersModel = require("../model/userModel");
const CorpModel = require("../model/corpModel")
const { corpRegisterValidate } = require("../utils/validation");

router.post("/register",async function (req, res) {
    console.log("Hitting Corp Register")
    const { error } = corpRegisterValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await UsersModel.findById(req.userId)

    const corp = new CorpModel({
        corpName: req.body.corpName,
        userId: req.userId,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gstin: req.body.gstin,
        phone: user.phone,
        altPhone : req.body.altPhone
    });
    
    
    try {
        const corpRecord = await corp.save();
        return res.status(201).json({ corpRecordID: corpRecord._id, message: "Corp registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Corp" });
    }
});

router.put("/update/:corpId",async function (req,res) {
    console.log("Hitting Update Corp")
    try{
        const corpId = req.params.corpId;
        if(!corpId){
            return res.status(400).json({message : "Need Corp Id"});
        }
        const updateFields = req.body;
        /// TODO: updateFields["updatedAt"] = "UPDATE THIS"
        const updatedCorp = await CorpModel.findByIdAndUpdate(
            corpId,
            { $set: updateFields },
            { new: true } // return the updated document
        );
      
        if (!updatedCorp) {
            return res.status(404).json({ message: 'Corp not found' });
        }
        return res.status(200).json({ message: 'Corp updated successfully', data: updatedCorp });
    } catch(err){
        console.log(err);
        return res.status(500).json({message : "Error updating the Corp"})
    } 
})

router.get("/getAll",async function (req, res) {
    console.log("Hitting Get All Corp")
    try {
    const corpRecords = await CorpModel.find()
    if(!corpRecords){
        return res.status(500).send({
            status: false,
            message: "No Vehicles found"
        });
    }
    return res.status(200).send({
        status: true,
        message: "Corp Records Found",
        corpRecords
    });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all the Corp" });
    }
});
module.exports = router;
