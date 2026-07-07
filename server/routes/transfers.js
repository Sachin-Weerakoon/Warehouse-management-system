const express = require('express');
const router = express.Router();
const { getTransfers, createTransfer } = require('../controllers/transferController');

router.route('/')
  .get(getTransfers)
  .post(createTransfer);

module.exports = router;
