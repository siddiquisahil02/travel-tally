const authRoutes = require('./auth.js');
const express = require('express');
const router = express.Router();
const corpRoutes = require('./corp.js')
const authMiddlewear = require("../middleware/authenticate.js")

router.use('/auth', authRoutes);
router.use('/corp',authMiddlewear, corpRoutes);


module.exports = router;