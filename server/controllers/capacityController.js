const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// Get Capacity Analytics Metrics
exports.getCapacityMetrics = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    
    // Core KPIs calculations
    const totalCap = warehouses.reduce((s, w) => s + w.totalCapacity, 0);
    const totalUsed = warehouses.reduce((s, w) => s + w.usedCapacity, 0);
    const overallPct = totalCap > 0 ? Math.round(totalUsed / totalCap * 100) : 0;
    const criticalCount = warehouses.filter((w) => w.usedCapacity / w.totalCapacity >= 0.9).length;
    const availablePositions = totalCap - totalUsed;

    // 1. Overall utilization pie data
    const pieData = [
      { name: 'Used', value: totalUsed, color: '#004ac6' },
      { name: 'Available', value: availablePositions, color: '#eaedff' }
    ];

    // 2. Zone Capacity Breakdown (Aggregate from Location collection across all warehouses)
    const zoneAgg = await Location.aggregate([
      {
        $group: {
          _id: '$zone',
          used: { $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 20, 0] } }, // mock 20 units per occupied location
          total: { $sum: 25 } // mock 25 units total capacity per location spot
        }
      }
    ]);

    const defaultZones = [
      { zone: 'Zone A', capacity: 1250, used: 1040, available: 210, category: 'Dry Goods' },
      { zone: 'Zone B', capacity: 1250, used: 875, available: 375, category: 'Cold Storage' },
      { zone: 'Zone C', capacity: 1250, used: 1175, available: 75, category: 'Bulk Items' },
      { zone: 'Zone D', capacity: 1250, used: 1160, available: 90, category: 'High-Value' }
    ];

    let zoneCapacity = defaultZones;
    if (zoneAgg.length > 0) {
      zoneCapacity = zoneAgg.map(z => {
        const capacity = z.total || 1250;
        const used = z.used || 0;
        return {
          zone: z._id,
          capacity,
          used,
          available: capacity - used,
          category: z._id === 'Zone A' ? 'Dry Goods' : z._id === 'Zone B' ? 'Cold Storage' : z._id === 'Zone C' ? 'Bulk Items' : 'High-Value'
        };
      }).sort((a, b) => a.zone.localeCompare(b.zone));
    }

    // 3. Warehouse Utilization bars
    const warehouseBar = warehouses.map((w) => ({
      name: w.name.replace(' Warehouse', '').replace(' Center', '').replace(' Facility', '').replace(' Hub', '').replace(' Depot', ''),
      used: w.usedCapacity,
      available: w.totalCapacity - w.usedCapacity,
      pct: w.totalCapacity > 0 ? Math.round(w.usedCapacity / w.totalCapacity * 100) : 0
    }));

    // 4. Monthly Trends (Historical line chart data)
    const trendData = [
      { month: 'Jan', Downtown: 72, North: 58, South: 80, East: 30 },
      { month: 'Feb', Downtown: 75, North: 60, South: 83, East: 32 },
      { month: 'Mar', Downtown: 78, North: 61, South: 85, East: 31 },
      { month: 'Apr', Downtown: 80, North: 59, South: 87, East: 33 },
      { month: 'May', Downtown: 82, North: 62, South: 89, East: 32 },
      { month: 'Jun', Downtown: 85, North: 62, South: 91, East: 33 }
    ];

    // 5. Capacity Alerts
    const alerts = warehouses
      .filter((w) => w.usedCapacity / w.totalCapacity >= 0.7)
      .map(w => {
        const pct = Math.round(w.usedCapacity / w.totalCapacity * 100);
        return {
          id: w._id,
          name: w.name,
          usedCapacity: w.usedCapacity,
          totalCapacity: w.totalCapacity,
          pct,
          isHigh: pct >= 90
        };
      });

    res.json({
      success: true,
      data: {
        totalCap,
        totalUsed,
        overallPct,
        criticalCount,
        availablePositions,
        pieData,
        zoneCapacity,
        warehouseBar,
        trendData,
        alerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
