const express = require('express');
const router = express.Router();
const { getCapacityMetrics } = require('../controllers/capacityController');

router.route('/')
  .get(getCapacityMetrics);

module.exports = router;
