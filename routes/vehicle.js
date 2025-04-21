const express = require("express");
const router = express.Router();
const VehicleModel = require("../model/vehicleModel")
const {vehicleRegisterValidate} = require("../utils/validation");
const CorpModel = require("../model/corpModel");

router.post("/register",async function (req, res) {
    console.log("Hitting Vehicle Register")
    try {
        const { error } = vehicleRegisterValidate.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const corp = await CorpModel.findOne({userId:req.userId})

        const vehicle = new VehicleModel({
            userId: req.userId,
            corpId: corp._id,
            model: req.body.model,
            color: req.body.color,
            year: req.body.year,
            registrationNumber: req.body.registrationNumber,
            totalKms: req.body.totalKms,
            mileage: req.body.mileage
        });
        
        const vehicleRecord = await vehicle.save();
        return res.status(201).json({ vehicleRecordId: vehicleRecord._id, message: "Vehicle registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error registering Vehicle" });
    }
});

// router.put("/update/:corpId",async function (req,res) {
//     console.log("Hitting Update Corp")
//     try{
//         const corpId = req.params.corpId;
//         if(!corpId){
//             return res.status(400).json({message : "Need Corp Id"});
//         }
//         const updateFields = req.body;
//         /// TODO: updateFields["updatedAt"] = "UPDATE THIS"
//         const updatedCorp = await CorpModel.findByIdAndUpdate(
//             corpId,
//             { $set: updateFields },
//             { new: true } // return the updated document
//         );
      
//         if (!updatedCorp) {
//             return res.status(404).json({ message: 'Corp not found' });
//         }
//         return res.status(200).json({ message: 'Corp updated successfully', data: updatedCorp });
//     } catch(err){
//         console.log(err);
//         return res.status(500).json({message : "Error updating the Corp"})
//     } 
// })

router.get("/getAll",async function (req, res) {
    console.log("Hitting Get All Corp")
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
