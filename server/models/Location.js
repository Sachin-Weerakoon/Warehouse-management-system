const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  locationCode: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  bay: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Occupied', 'Empty', 'Reserved', 'Maintenance'],
    default: 'Empty'
  },
  sku: {
    type: String,
    default: undefined
  },
  product: {
    type: String,
    default: undefined
  },
  qty: {
    type: Number,
    default: undefined
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);
