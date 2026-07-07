const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');
const Transfer = require('../models/Transfer');

const WAREHOUSES = [
  { name: "Downtown Main Warehouse", code: "DWN-001", address: "150 Elm Street", city: "Melbourne, VIC", manager: "Sarah Mitchell", totalCapacity: 5000, usedCapacity: 4250, totalLocations: 240, activeSkus: 1843, status: "Active" },
  { name: "North Distribution Center", code: "NDC-002", address: "890 Industrial Blvd", city: "Sydney, NSW", manager: "James Patel", totalCapacity: 8000, usedCapacity: 4960, totalLocations: 380, activeSkus: 2910, status: "Active" },
  { name: "South Storage Facility", code: "SSF-003", address: "445 Commerce Ave", city: "Brisbane, QLD", manager: "Priya Nair", totalCapacity: 3200, usedCapacity: 2912, totalLocations: 160, activeSkus: 1205, status: "Active" },
  { name: "East Fulfillment Hub", code: "EFH-004", address: "1200 Harbor Drive", city: "Perth, WA", manager: "Tom Nguyen", totalCapacity: 6500, usedCapacity: 2145, totalLocations: 310, activeSkus: 878, status: "Maintenance" },
  { name: "West Regional Depot", code: "WRD-005", address: "78 Logistics Park", city: "Adelaide, SA", manager: "Anna Lee", totalCapacity: 2800, usedCapacity: 1260, totalLocations: 140, activeSkus: 654, status: "Active" }
];

const TRANSFERS = [
  { transferNumber: "TRF-0891", fromWarehouse: "Downtown Main Warehouse", toWarehouse: "North Distribution Center", sku: "SKU-10045", product: "Wireless Headphones", qty: 120, priority: "High", status: "In Transit", requestedBy: "Sarah Mitchell", date: "2026-06-10", notes: "Urgent replenishment" },
  { transferNumber: "TRF-0890", fromWarehouse: "South Storage Facility", toWarehouse: "Downtown Main Warehouse", sku: "SKU-10089", product: "Smart Watch Pro", qty: 45, priority: "Normal", status: "Pending", requestedBy: "Priya Nair", date: "2026-06-10" },
  { transferNumber: "TRF-0889", fromWarehouse: "North Distribution Center", toWarehouse: "East Fulfillment Hub", sku: "SKU-10112", product: "USB-C Hub 7-in-1", qty: 200, priority: "Normal", status: "Pending", requestedBy: "James Patel", date: "2026-06-09" },
  { transferNumber: "TRF-0888", fromWarehouse: "West Regional Depot", toWarehouse: "South Storage Facility", sku: "SKU-10034", product: "Laptop Stand Adjustable", qty: 60, priority: "Low", status: "Completed", requestedBy: "Anna Lee", date: "2026-06-08", completedDate: "2026-06-09" },
  { transferNumber: "TRF-0887", fromWarehouse: "Downtown Main Warehouse", toWarehouse: "West Regional Depot", sku: "SKU-10078", product: "Mechanical Keyboard TKL", qty: 30, priority: "High", status: "Completed", requestedBy: "Alex Chen", date: "2026-06-07", completedDate: "2026-06-08" },
  { transferNumber: "TRF-0886", fromWarehouse: "East Fulfillment Hub", toWarehouse: "Downtown Main Warehouse", sku: "SKU-10156", product: "4K Webcam", qty: 15, priority: "High", status: "Cancelled", requestedBy: "Tom Nguyen", date: "2026-06-06", notes: "Supplier delay" },
  { transferNumber: "TRF-0885", fromWarehouse: "North Distribution Center", toWarehouse: "South Storage Facility", sku: "SKU-10023", product: "Phone Case MagSafe", qty: 500, priority: "Normal", status: "Completed", requestedBy: "James Patel", date: "2026-06-05", completedDate: "2026-06-06" },
  { transferNumber: "TRF-0884", fromWarehouse: "South Storage Facility", toWarehouse: "East Fulfillment Hub", sku: "SKU-10067", product: "Monitor Arm Dual", qty: 25, priority: "Normal", status: "Completed", requestedBy: "Priya Nair", date: "2026-06-04", completedDate: "2026-06-05" },
  { transferNumber: "TRF-0883", fromWarehouse: "West Regional Depot", toWarehouse: "North Distribution Center", sku: "SKU-10099", product: "SSD Drive 1TB", qty: 80, priority: "High", status: "Completed", requestedBy: "Anna Lee", date: "2026-06-03", completedDate: "2026-06-04" }
];

function generateLocations(warehouseId) {
  const zones = ["A", "B", "C", "D"];
  const rows = ["01", "02", "03", "04", "05"];
  const levels = ["L1", "L2", "L3"];
  const statuses = ["Occupied", "Occupied", "Occupied", "Empty", "Reserved", "Occupied", "Empty", "Maintenance"];
  const products = ["Wireless Headphones", "Smart Watch", "USB-C Cable", "Laptop Stand", "Mouse Pad", "Phone Case", "Keyboard", "Monitor Arm", "Webcam", "SSD Drive"];
  const locs = [];
  
  let i = 0;
  for (const zone of zones) {
    for (const row of rows) {
      for (let bay = 1; bay <= 4; bay++) {
        for (const level of levels) {
          const status = statuses[i % statuses.length];
          locs.push({
            warehouseId,
            locationCode: `${zone}-${row}-${String(bay).padStart(2, "0")}-${level}`,
            zone: `Zone ${zone}`,
            row: `Row ${row}`,
            bay,
            level,
            status,
            sku: status === "Occupied" ? `SKU-${String(1000 + i).padStart(5, "0")}` : undefined,
            product: status === "Occupied" ? products[i % products.length] : undefined,
            qty: status === "Occupied" ? Math.floor(Math.random() * 80 + 10) : undefined
          });
          i++;
        }
      }
    }
  }
  return locs;
}

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!connStr) {
      throw new Error('MongoDB URI not defined in environment variables.');
    }
    
    console.log('Connecting to database for seeding...');
    await mongoose.connect(connStr);
    console.log('Connected.');

    // Clear existing collections
    console.log('Clearing existing Warehouse module collections...');
    await Warehouse.deleteMany({});
    await Location.deleteMany({});
    await Transfer.deleteMany({});
    console.log('Collections cleared.');

    // Insert Warehouses
    console.log('Seeding warehouses...');
    const createdWarehouses = await Warehouse.insertMany(WAREHOUSES);
    console.log(`Seeded ${createdWarehouses.length} warehouses.`);

    // Insert Locations for each warehouse
    console.log('Generating and seeding rack locations...');
    let totalLocCount = 0;
    for (const wh of createdWarehouses) {
      const locations = generateLocations(wh._id);
      await Location.insertMany(locations);
      totalLocCount += locations.length;
      
      // Update actual details counts
      wh.totalLocations = locations.length;
      wh.usedCapacity = locations.filter(l => l.status === 'Occupied').length * 20; // 20 units per occupied location avg
      wh.activeSkus = [...new Set(locations.filter(l => l.sku).map(l => l.sku))].length;
      await wh.save();
    }
    console.log(`Seeded ${totalLocCount} rack locations across warehouses.`);

    // Insert Transfers
    console.log('Seeding stock transfers...');
    await Transfer.insertMany(TRANSFERS);
    console.log(`Seeded ${TRANSFERS.length} transfers.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
