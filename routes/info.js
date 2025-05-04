const express = require("express")
const UsersModel = require("../model/userModel")
const CorpModel = require("../model/corpModel")
const router = express.Router()

router.get("/me", async (req,res)=>{
    console.log("Hitting Get Me Info")
    try {
        //const user = await UsersModel.findById(req.userId)
        const corp = await CorpModel.findOne({
            userId:req.userId
        },"corpName city state altPhone -_id").populate({
            path:'userId',
            select:"firstName lastName email phone phoneVerified profilePicture role subscriptionStartDate subscriptionEndDate subscriptionStatus -_id"
        })
        return res.status(200).send(corp);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error getting the info."})
    }
})

module.exports = router