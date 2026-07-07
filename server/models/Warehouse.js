const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  manager: {
    type: String,
    required: true
  },
  totalCapacity: {
    type: Number,
    required: true,
    default: 0
  },
  usedCapacity: {
    type: Number,
    required: true,
    default: 0
  },
  totalLocations: {
    type: Number,
    required: true,
    default: 0
  },
  activeSkus: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);
