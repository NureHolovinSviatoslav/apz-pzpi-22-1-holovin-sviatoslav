'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');
const { Location } = require('./Location');

const Inventory = sequelize.define(
  'inventory',
  {
    inventory_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Location,
        key: 'location_id',
      },
    },
    max_quantity: Sequelize.INTEGER,
  },
  {
    tableName: 'inventory',
    timestamps: false,
  },
);

Inventory.belongsTo(Location, { foreignKey: 'location_id' });
Location.hasMany(Inventory, { foreignKey: 'location_id' });

module.exports = {
  Inventory,
};
