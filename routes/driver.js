const express = require('express')
const { driverController, getAllDrivers, uploadImage, updateDriver } = require('../controller/driverController')

const multer = require('multer');   
const upload = multer({ dest: 'uploads/' });

const router = express.Router()

// Create Driver Details || POST
router.post("/register", driverController)

// GET ALL DRIVER || GET
router.get("/get", getAllDrivers)

router.post("/uploadfile/:type/:driverId", upload.single("file"),uploadImage)

router.put("/update/:driverId",updateDriver)

module.exports = router