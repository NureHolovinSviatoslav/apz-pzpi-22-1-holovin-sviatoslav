'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');
const { User } = require('./User');

const Order = sequelize.define(
  'order',
  {
    order_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      references: {
        model: User,
        key: 'username',
      },
    },
    order_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    order_status: {
      type: Sequelize.STRING,
      defaultValue: 'new',
    },
  },
  {
    tableName: 'order',
    timestamps: false,
  },
);

Order.belongsTo(User, { foreignKey: 'username', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'username', onDelete: 'CASCADE' });

module.exports = {
  Order,
};
