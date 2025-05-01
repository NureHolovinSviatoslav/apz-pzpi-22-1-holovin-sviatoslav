'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');
const { Order } = require('./Order');
const { Vaccine } = require('./Vaccine');

const OrderItem = sequelize.define(
  'order_item',
  {
    order_item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Order,
        key: 'order_id',
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
    tableName: 'order_item',
    timestamps: false,
  },
);

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });

OrderItem.belongsTo(Vaccine, { foreignKey: 'vaccine_id' });
Vaccine.hasMany(OrderItem, { foreignKey: 'vaccine_id' });

module.exports = {
  OrderItem,
};
