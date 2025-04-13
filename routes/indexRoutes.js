const authRoutes = require('./auth.js');
const express = require('express');
const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;