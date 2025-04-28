const {driverRegisterValidate} = require('../utils/validation')
const DriverModel = require('../model/driversModel')
const ImageKit = require('imagekit')
const fs = require('fs')
const CorpModel = require('../model/corpModel')

const ikPublicKey = process.env.IMAGEKIT_PUBLIC_KEY
const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY
const ikDomain = process.env.IMAGEKIT_URL_ENDPOINT

const imagekit = new ImageKit({
    publicKey: ikPublicKey,    
    privateKey: ikPrivateKey,      
    urlEndpoint: ikDomain 
});

// Register || POST
const driverController = async (req, res) => {
    try {
        const { error } = driverRegisterValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const {firstName, lastName, phone, aadhar, license, address, joiningDate} = req.body

    const existingUser = await DriverModel.findOne({ phone: phone });
    if (existingUser) {
        return res.status(400).json({ message: "Phone number already exists" });
    }

    const corp = await CorpModel.findOne({userId:req.userId})
    if(!corp){
        return res.status(400).json({ message: "Corp not found" });
    }

    const driver = new DriverModel({
        userId: req.userId,
        corpId: corp._id,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        aadhar: aadhar,
        license: license,
        address: address,
        joiningDate: joiningDate
    })
    const dri = await driver.save()
    res.status(201).send({
        status: true,
        message: "Driver Registration Success",
        driver_id: dri._id
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Driver Registration Failed"
        })
    }
}

const getAllDrivers = async (req, res) => {
    try {
        const driver = await DriverModel.find()
        if(!driver){
            return res.status(500).send({
                status: false,
                message: "Driver Details not found"
            }) 
        } 
        res.status(200).send({
            status: true,
            length: driver.length,
            driver
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Driver Details not found"
        })
    }
}

const uploadImage = async (req, res)=>{
    try {
        const type = req.params.type;
        if(!type){
            return res.status(400).json({ message: "No type provided" });
        }
        if(type=="Licence" || type=="Aadhar"){
            const driverId = req.params.driverId;
            if(!driverId){
                return res.status(400).json({ message: "No Driver ID provided" });
            }
            const driver = await DriverModel.findOne({_id:driverId, userId: req.userId});
            if(!driver){
                return res.status(400).json({ message: "Driver not found" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const filePath = req.file.path;
            const fileName = req.file.originalname;
            const fileBuffer = fs.readFileSync(filePath);
            const response = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: `/Travel-Tally/${type}`
            });
            fs.unlinkSync(filePath);
            if(type=="Licence"){
                driver.license = response.url;
            }
            if(type=="Aadhar"){
                driver.aadhar = response.url;
            }
            await driver.save();
            return res.status(200).json({
                message: `${type} uploaded successfully!`,
            });
        }else{
            return res.status(400).json({ message: "Invalid type provided" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image' });
      }
    };

const updateDriver = async (req,res)=>{
        console.log("Hitting Update Driver")
        try{
            const driverId = req.params.driverId;
            if(!driverId){
                return res.status(400).json({message : "Need Driver Id"});
            }
            const updateFields = req.body;
            const updatedDriver = await DriverModel.findByIdAndUpdate(
                driverId,
                { $set: updateFields },
                { new: true } // return the updated document
            );
          
            if (!updatedDriver) {
                return res.status(404).json({ message: 'Driver not found' });
            }
            return res.status(200).json({ message: 'Driver updated successfully', data: updatedDriver});
        } catch(err){
            console.log(err);
            return res.status(500).json({message : "Error updating the Driver"})
        } 
}

module.exports = {driverController, getAllDrivers, uploadImage, updateDriver}