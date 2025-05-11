'use strict';

const { Inventory } = require('../models/Inventory');
const express = require('express');
const { InventoryItem } = require('../models/InventoryItem');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { roles } = require('../services/roles');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const inventories = await Inventory.findAll();
    res.send(inventories);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const inventory = await Inventory.findByPk(parseInt(id));
    if (!inventory) {
      return res.status(404).send('Inventory not found');
    }
    res.send(inventory);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const inventoryData = { ...req.body };

  try {
    const inventory = await Inventory.create(inventoryData);
    res.status(201).send(inventory);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const inventoryData = { ...req.body };

  try {
    const inventoryItems = await InventoryItem.findAll({
      where: { inventory_id: parseInt(id) },
    });

    if (
      inventoryData.max_quantity <
      inventoryItems.reduce((acc, item) => acc + item.quantity, 0)
    ) {
      return res.status(412).send('Max quantity exceeded');
    }

    await Inventory.update(inventoryData, {
      where: { inventory_id: parseInt(id) },
    });
    const inventory = await Inventory.findByPk(parseInt(id));
    if (!inventory) {
      return res.status(404).send('Inventory not found');
    }
    res.send(inventory);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    await InventoryItem.destroy({ where: { inventory_id: parseInt(id) } });
    const deleted = await Inventory.destroy({
      where: { inventory_id: parseInt(id) },
    });
    if (!deleted) {
      return res.status(404).send('Inventory not found');
    }
    res.status(204).send({});
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
