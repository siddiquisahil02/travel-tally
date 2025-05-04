const express = require('express')
const { driverController, getAllDrivers, uploadImage, updateDriver , deleteDriver} = require('../controller/driverController')

const multer = require('multer');   
const upload = multer({ dest: 'uploads/' });

const router = express.Router()

// Create Driver Details || POST
router.post("/register", driverController)

// GET ALL DRIVER || GET
router.get("/get", getAllDrivers)

const cpUpload = upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }])
router.post("/uploadfile/:type/:driverId", cpUpload,uploadImage)

router.put("/update/:driverId",updateDriver)

router.delete("/delete/:driverId",deleteDriver)

module.exports = router