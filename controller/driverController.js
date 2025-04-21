const {driverRegisterValidate} = require('../utils/validation')
const driverModel = require('../model/driversModel')

// Register || POST
const driverController = async (req, res) => {
    try {
        const { error } = driverRegisterValidate.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const {firstName, lastName, phone, aadhar, license, address, joiningDate} = req.body

    const driver = new driverModel({
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
        res.status(500).send({
            status: false,
            message: "Driver Registration Failed"
        })
    }
}

const getAllDrivers = async (req, res) => {
    try {
        const driver = await driverModel.find()
        if(!driver){
            return res.status(500).send({
                status: false,
                message: "Driver Details not found"
            }) 
        } 
        res.status(200).send({
            status: true,
            message: "Driver Details found",
            driver
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Driver Details not found"
        })
    }
}

module.exports = {driverController, getAllDrivers}