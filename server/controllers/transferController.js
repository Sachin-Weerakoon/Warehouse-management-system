const Transfer = require('../models/Transfer');

// Get all transfers
exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: transfers.length, data: transfers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a transfer request
exports.createTransfer = async (req, res) => {
  try {
    const { from, to, sku, product, qty, priority, notes } = req.body;
    
    // Generate transfer number
    const count = await Transfer.countDocuments({});
    const transferNumber = `TRF-${String(892 + count).padStart(4, '0')}`;

    const newTransfer = new Transfer({
      transferNumber,
      fromWarehouse: from,
      toWarehouse: to,
      sku,
      product,
      qty: Number(qty) || 0,
      priority: priority || 'Normal',
      status: 'Pending',
      requestedBy: 'Alex Chen', // Mock logged-in user
      date: new Date().toISOString().split('T')[0],
      notes
    });

    await newTransfer.save();
    res.status(201).json({ success: true, data: newTransfer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
