const express = require('express');
const userRoutes = require('./userRoutes');
const contractRoutes = require('./contractRoutes');

const router = express.Router();

// Set up routes
router.use('/user', userRoutes);
router.use('/contract', contractRoutes);

module.exports = router;