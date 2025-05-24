const authRoutes = require('./auth.js');
const express = require('express');
const router = express.Router();
const corpRoutes = require('./corp.js')
const authMiddlewear = require("../middleware/authenticate.js")
const driverRoutes = require("./driver.js")
const vehicleRoutes = require("./vehicle.js")
const infoRoutes = require("./info.js")
const clientRoutes = require("./client.js")
const serviceRecordsRoutes  = require("./serviceRecords.js")

router.use('/auth', authRoutes);
router.use('/corp',authMiddlewear, corpRoutes);
router.use('/driver',authMiddlewear, driverRoutes);
router.use('/vehicle',authMiddlewear, vehicleRoutes);
router.use('/info',authMiddlewear, infoRoutes);
router.use('/client',authMiddlewear, clientRoutes);
router.use('/serviceRecords',authMiddlewear,serviceRecordsRoutes);

module.exports = router;