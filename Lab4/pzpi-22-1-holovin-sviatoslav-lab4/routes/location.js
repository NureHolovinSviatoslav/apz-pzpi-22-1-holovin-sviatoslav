'use strict';

const { Inventory } = require('../models/Inventory');
const { InventoryItem } = require('../models/InventoryItem');
const { Vaccine } = require('../models/Vaccine');
const { Location } = require('../models/Location');
const { SensorData } = require('../models/SensorData');
const express = require('express');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { roles } = require('../services/roles');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.send(locations);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findByPk(parseInt(id));
    if (!location) {
      return res.status(404).send('Location not found');
    }
    res.send(location);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const locationData = { ...req.body };

  try {
    const location = await Location.create(locationData);
    res.status(201).send(location);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const locationData = { ...req.body };

  try {
    await Location.update(locationData, {
      where: { location_id: parseInt(id) },
    });
    const location = await Location.findByPk(parseInt(id));
    if (!location) {
      return res.status(404).send('Location not found');
    }
    res.send(location);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    await Inventory.destroy({
      where: { location_id: parseInt(id) },
    });
    await SensorData.destroy({
      where: { location_id: parseInt(id) },
    });
    const deleted = await Location.destroy({
      where: { location_id: parseInt(id) },
    });
    if (!deleted) {
      return res.status(404).send('Location not found');
    }
    res.status(204).send({});
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getReport = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findByPk(parseInt(id));
    if (!location) {
      return res.status(404).send('Location not found');
    }

    const inventories = await Inventory.findAll({
      where: { location_id: parseInt(id) },
    });
    const inventoryItems = await Promise.all(
      inventories.map(async (inventory) => {
        const itemWithVaccine = await InventoryItem.findAll({
          where: { inventory_id: inventory.inventory_id },
          include: Vaccine,
        });

        return {
          inventory_id: inventory.inventory_id,
          max_quantity: inventory.max_quantity,
          used_quantity: itemWithVaccine.reduce(
            (acc, item) => acc + item.quantity,
            0,
          ),
          stored_vaccines: itemWithVaccine.map((item) => ({
            vaccine_id: item.vaccine_id,
            name: item.vaccine.name,
            description: item.vaccine.description,
            quantity: item.quantity,
          })),
        };
      }),
    );

    res.send({
      location_id: location.location_id,
      name: location.name,
      address: location.address,
      inventories: inventoryItems,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

router.get(
  '/',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  getAll,
);
router.get(
  '/:id',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  getOne,
);
router.get(
  '/:id/report',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  getReport,
);
router.post(
  '/',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  add,
);
router.patch(
  '/:id',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  update,
);
router.delete(
  '/:id',
  ...createAuthMiddleware([roles.STAFF, roles.ADMIN, roles.DBO]),
  remove,
);

module.exports = { router };
