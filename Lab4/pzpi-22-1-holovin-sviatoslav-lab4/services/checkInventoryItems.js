const { SensorData } = require('../models/SensorData');
const { Location } = require('../models/Location');
const { Inventory } = require('../models/Inventory');
const { InventoryItem } = require('../models/InventoryItem');
const { Vaccine } = require('../models/Vaccine');

const checkInventoryItems = async (id) => {
  const inventoryItem = await InventoryItem.findByPk(id, {
    include: [{ model: Vaccine, attributes: ['vaccine_id', 'name'] }],
  });

  const inventory = await Inventory.findByPk(inventoryItem.inventory_id);
  const location = await Location.findByPk(inventory.location_id);

  if (inventoryItem.quantity === 0) {
    return {
      location_id: location.location_id,
      location_name: location.name,
      location_address: location.address,
      phone: location.responsible_user_phone,
      inventory_id: inventory.inventory_id,
      inventory_item_id: inventoryItem.inventory_item_id,
      vaccine_id: inventoryItem.vaccine.vaccine_id,
      vaccine_name: inventoryItem.vaccine.name,
    };
  }
  return null;
};

module.exports = {
  checkInventoryItems,
};
