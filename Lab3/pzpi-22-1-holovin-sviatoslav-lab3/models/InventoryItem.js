'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');
const { Inventory } = require('./Inventory');
const { Vaccine } = require('./Vaccine');

const InventoryItem = sequelize.define(
  'inventory_item',
  {
    inventory_item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inventory_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Inventory,
        key: 'inventory_id',
      },
    },
    vaccine_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Vaccine,
        key: 'vaccine_id',
      },
    },
    quantity: Sequelize.INTEGER,
  },
  {
    tableName: 'inventory_item',
    timestamps: false,
  },
);

InventoryItem.belongsTo(Inventory, { foreignKey: 'inventory_id' });
Inventory.hasMany(InventoryItem, { foreignKey: 'inventory_id' });

InventoryItem.belongsTo(Vaccine, { foreignKey: 'vaccine_id' });
Vaccine.hasMany(InventoryItem, { foreignKey: 'vaccine_id' });

module.exports = {
  InventoryItem,
};
