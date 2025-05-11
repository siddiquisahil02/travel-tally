const express = require("express");
const router = express.Router();
const CorpModel = require("../model/corpModel")
const { clientRegisterValidate } = require("../utils/validation");
const ClientModel = require("../model/clientModel");
const rateRoutes = require("./rate.js")

router.post("/register",async function (req, res) {
    console.log("Hitting client Register")
    const { error } = clientRegisterValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const corp = await CorpModel.findOne({userId:req.userId})
    if(!corp){
        return res.status(400).json({ message: "Corp not found" });
    }

    const client = new ClientModel({
        userId: req.userId,
        corpId: corp._id,
        clientName: req.body.clientName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gstin: req.body.gstin,
        phone: req.body.phone,
        email: req.body.email
    });
    
    try {
        const clientRecord = await client.save();
        return res.status(201).json({ clientRecordId: clientRecord._id, message: "Client registered successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error registering Client ${err}` });
    }
});

router.get("/getAll",async function (req, res) {
    console.log("Hitting Get All Clients")
    try {
        const clientRecords = await ClientModel.find({userId:req.userId})
        return res.status(200).send({status: true, length: clientRecords.length,clientRecords});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error Getting all the Clients" });
    }
}
);

router.put("/update/:clientId",async function (req, res) {
    console.log("Hitting Update Client")
    try {
        const clientId = req.params.clientId;
        const client = await ClientModel.findByIdAndUpdate(clientId, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        return res.status(200).json({ message: "Client updated successfully", client });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating Client" });
    }
}
);
router.delete("/delete/:clientId",async function (req, res) {
    console.log("Hitting Delete Client")
    try {
        const clientId = req.params.clientId;
        const client = await ClientModel.findByIdAndDelete(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        return res.status(200).json({ message: "Client deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting Client" });
    }
}
);

router.use("/rate",rateRoutes)
module.exports = router;
