const { SensorData } = require('../models/SensorData');
const { Location } = require('../models/Location');
const { Inventory } = require('../models/Inventory');
const { InventoryItem } = require('../models/InventoryItem');
const { Vaccine } = require('../models/Vaccine');

const checkSensorData = async (id) => {
  const sensorData = await SensorData.findByPk(id, {
    include: [
      {
        model: Location,
        attributes: ['location_id', 'name', 'address'],
      },
    ],
  });

  const { temperature, humidity, location } = sensorData;

  const inventories = await Inventory.findAll({
    where: {
      location_id: location.location_id,
    },
  });

  for (const inventory of inventories) {
    const inventoryItems = await InventoryItem.findAll({
      where: {
        inventory_id: inventory.inventory_id,
      },
      include: [
        {
          model: Vaccine,
          attributes: [
            'vaccine_id',
            'name',
            'min_temperature',
            'max_temperature',
            'min_humidity',
            'max_humidity',
          ],
        },
      ],
    });

    for (const inventoryItem of inventoryItems) {
      const { vaccine } = inventoryItem;
      if (
        temperature < vaccine.min_temperature ||
        temperature > vaccine.max_temperature ||
        humidity < vaccine.min_humidity ||
        humidity > vaccine.max_humidity
      ) {
        return {
          location_id: location.location_id,
          location_name: location.name,
          location_address: location.address,
          phone: location.responsible_user_phone,
          inventory_id: inventory.inventory_id,
          inventory_item_id: inventoryItem.inventory_item_id,
          vaccine_id: vaccine.vaccine_id,
          vaccine_name: vaccine.name,
          error: {
            low_temperature: temperature < vaccine.min_temperature,
            high_temperature: temperature > vaccine.max_temperature,
            low_humidity: humidity < vaccine.min_humidity,
            high_humidity: humidity > vaccine.max_humidity,
          },
        };
      }
    }
  }

  return null;
};

module.exports = {
  checkSensorData,
};
