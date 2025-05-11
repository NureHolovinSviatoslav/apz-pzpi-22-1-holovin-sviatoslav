'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');
const { User } = require('./User');

const Notification = sequelize.define(
  'notification',
  {
    notification_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: Sequelize.STRING,
    sent_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    message: Sequelize.TEXT,
    notification_type: Sequelize.STRING,
  },
  {
    tableName: 'notification',
    timestamps: false,
  },
);

module.exports = {
  Notification,
};
