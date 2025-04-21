const authRoutes = require('./auth.js');
const express = require('express');
const router = express.Router();
const corpRoutes = require('./corp.js')
const authMiddlewear = require("../middleware/authenticate.js")
const driverRoutes = require("../routes/driver.js")
const vehicleRoutes = require("../routes/vehicle.js")

router.use('/auth', authRoutes);
router.use('/corp',authMiddlewear, corpRoutes);
router.use('/driver',authMiddlewear, driverRoutes);
router.use('/vehicle',authMiddlewear, vehicleRoutes)


module.exports = router;