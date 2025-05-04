const {driverRegisterValidate} = require('../utils/validation')
const DriverModel = require('../model/driversModel')
const ImageKit = require('imagekit')
const fs = require('fs')
const path = require('path')
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
    console.log("Hitting Driver Registration")
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
    console.log("Hitting Get All Drivers")
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
        console.log("Hitting Upload Image")
        const type = req.params.type;
        if(!type){
            fs.unlink(req.files.front[0].path,(err)=>{console.log});
            fs.unlink(req.files.back[0].path,(err)=>{console.log});
            return res.status(400).json({ message: "No type provided" });
        }
        if(type=="Licence" || type=="Aadhar"){
            const driverId = req.params.driverId;
            if(!driverId){
                fs.unlink(req.files.front[0].path,(err)=>{console.log});
                fs.unlink(req.files.back[0].path,(err)=>{console.log});
                return res.status(400).json({ message: "No Driver ID provided" });
            }
            const driver = await DriverModel.findOne({_id:driverId, userId: req.userId});
            if(!driver){
                fs.unlink(req.files.front[0].path,(err)=>{console.log});
                fs.unlink(req.files.back[0].path,(err)=>{console.log});
                return res.status(400).json({ message: "Driver not found" });
            }
            if(driver.license.length > 0 && type=="Licence"){
                fs.unlink(req.files.front[0].path,(err)=>{console.log});
                fs.unlink(req.files.back[0].path,(err)=>{console.log});
                return res.status(400).json({ message: "License already uploaded" });
            }
            if(driver.aadhar.length > 0 && type=="Aadhar"){
                fs.unlink(req.files.front[0].path,(err)=>{console.log});
                fs.unlink(req.files.back[0].path,(err)=>{console.log});
                return res.status(400).json({ message: "Aadhar already uploaded" });
            }
            const files = req.files;
            // console.log(files)
            if (!files || !files.front || !files.back) {
                fs.unlink(req.files.front[0].path,(err)=>{console.log});
                fs.unlink(req.files.back[0].path,(err)=>{console.log});
                return res.status(400).json({ error: 'Both Front and Back images are required' });
            }
            const uploadToImageKit = async (file) => {
                const buffer = fs.readFileSync(file.path);
                const result = await imagekit.upload({
                  file: buffer,
                  fileName: file.originalname,
                  folder: `/Travel-Tally/${type}`,
                });
               
                fs.unlink(file.path, (err) => {
                    if (err) throw err;
                });
                    
                return result.url;
            };
            const frontResUrl = await uploadToImageKit(files.front[0]);
            const backResUrl = await uploadToImageKit(files.back[0]);
            if(type=="Licence"){
                driver.license.push(frontResUrl);
                driver.license.push(backResUrl);
            }
            if(type=="Aadhar"){
                driver.aadhar.push(frontResUrl)   
                driver.aadhar.push(backResUrl)   
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

const deleteDriver = async (req,res)=>{
    console.log("Hitting Delete Driver")
    try{
        const driverId = req.params.driverId;
        if(!driverId){
            return res.status(400).json({message : "Need Driver Id"});
        }
        const deletedDriver = await DriverModel.findByIdAndDelete(driverId);
        if (!deletedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        return res.status(200).json({ message: 'Driver deleted successfully'});
    } catch(err){
        console.log(err);
        return res.status(500).json({message : "Error deleting the Driver"})
    } 
}

module.exports = {driverController, getAllDrivers, uploadImage, updateDriver, deleteDriver}