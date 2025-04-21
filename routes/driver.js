const express = require('express')
const { driverController, getAllDrivers } = require('../controller/driverController')

const router = express.Router()

// Create Driver Details || POST
router.post("/register", driverController)

// GET ALL DRIVER || GET
router.get("/get", getAllDrivers)

module.exports = router