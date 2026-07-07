const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// Get all warehouses
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    res.json({ success: true, count: warehouses.length, data: warehouses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get warehouse by ID
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }
    
    // Aggregate zones from actual database locations if possible, or fall back to default breakdown
    const zones = await Location.aggregate([
      { $match: { warehouseId: warehouse._id } },
      {
        $group: {
          _id: '$zone',
          total: { $sum: 1 },
          used: { $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 1, 0] } }
        }
      }
    ]);
    
    const zoneData = zones.map(z => ({
      zone: z._id,
      total: z.total,
      used: z.used,
      category: z._id === 'Zone A' ? 'Dry Goods' : z._id === 'Zone B' ? 'Cold Storage' : z._id === 'Zone C' ? 'Bulk Items' : 'High-Value'
    })).sort((a, b) => a.zone.localeCompare(b.zone));

    res.json({ 
      success: true, 
      data: {
        ...warehouse.toObject(),
        zoneData: zoneData.length ? zoneData : [
          { zone: 'Zone A', total: 60, used: 52, category: 'Dry Goods' },
          { zone: 'Zone B', total: 60, used: 48, category: 'Cold Storage' },
          { zone: 'Zone C', total: 60, used: 41, category: 'Bulk Items' },
          { zone: 'Zone D', total: 60, used: 58, category: 'High-Value' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const { name, code, address, city, manager, totalCapacity } = req.body;
    
    // Check if code already exists
    const exists = await Warehouse.findOne({ code });
    if (exists) {
      return res.status(400).json({ success: false, message: `Warehouse with code ${code} already exists.` });
    }

    const warehouse = new Warehouse({
      name,
      code,
      address,
      city,
      manager,
      totalCapacity: Number(totalCapacity) || 5000,
      usedCapacity: 0,
      totalLocations: 120, // default locations
      activeSkus: 0,
      status: 'Active'
    });

    await warehouse.save();

    // Dynamically generate default locations for this new warehouse in database
    const zones = ['A', 'B', 'C', 'D'];
    const rows = ['01', '02', '03'];
    const levels = ['L1', 'L2'];
    const products = ['Wireless Headphones', 'Smart Watch', 'USB-C Cable', 'Laptop Stand', 'Mouse Pad'];
    const locationsToInsert = [];

    let count = 0;
    for (const zone of zones) {
      for (const row of rows) {
        for (let bay = 1; bay <= 5; bay++) {
          for (const level of levels) {
            const isOccupied = count % 3 === 0; // occupied ratio
            locationsToInsert.push({
              warehouseId: warehouse._id,
              locationCode: `${zone}-${row}-${String(bay).padStart(2, '0')}-${level}`,
              zone: `Zone ${zone}`,
              row: `Row ${row}`,
              bay,
              level,
              status: isOccupied ? 'Occupied' : 'Empty',
              sku: isOccupied ? `SKU-${String(1000 + count).padStart(5, '0')}` : undefined,
              product: isOccupied ? products[count % products.length] : undefined,
              qty: isOccupied ? Math.floor(Math.random() * 80 + 10) : undefined
            });
            count++;
          }
        }
      }
    }

    await Location.insertMany(locationsToInsert);
    
    // Update warehouse counts based on generated locations
    warehouse.totalLocations = locationsToInsert.length;
    warehouse.usedCapacity = locationsToInsert.filter(l => l.status === 'Occupied').length * 20; // 20 units per occupied location avg
    warehouse.activeSkus = [...new Set(locationsToInsert.filter(l => l.sku).map(l => l.sku))].length;
    await warehouse.save();

    res.status(201).json({ success: true, data: warehouse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get warehouse storage locations
exports.getWarehouseLocations = async (req, res) => {
  try {
    const locations = await Location.find({ warehouseId: req.params.id });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
