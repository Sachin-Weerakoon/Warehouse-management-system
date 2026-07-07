const express = require('express');
const router = express.Router();
const { getWarehouses, getWarehouseById, createWarehouse, getWarehouseLocations } = require('../controllers/warehouseController');

router.route('/')
  .get(getWarehouses)
  .post(createWarehouse);

router.route('/:id')
  .get(getWarehouseById);

router.route('/:id/locations')
  .get(getWarehouseLocations);

module.exports = router;
