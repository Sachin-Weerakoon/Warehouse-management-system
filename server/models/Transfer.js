const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    required: true,
    unique: true
  },
  fromWarehouse: {
    type: String,
    required: true
  },
  toWarehouse: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  requestedBy: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  completedDate: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transfer', TransferSchema);
