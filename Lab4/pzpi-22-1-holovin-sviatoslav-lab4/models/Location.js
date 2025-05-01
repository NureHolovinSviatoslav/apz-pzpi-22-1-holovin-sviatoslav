'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('../services/db');

const Location = sequelize.define(
  'location',
  {
    location_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    responsible_user_phone: Sequelize.STRING,
  },
  {
    tableName: 'location',
    timestamps: false,
  },
);

module.exports = {
  Location,
};
