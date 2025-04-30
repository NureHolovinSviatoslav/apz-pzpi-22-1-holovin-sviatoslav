'use strict';

const { InventoryItem } = require('../models/InventoryItem');
const express = require('express');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { roles } = require('../services/roles');
const { Inventory } = require('../models/Inventory');
const { checkInventoryItems } = require('../services/checkInventoryItems');
const {
  formatAlertMessage,
  sendSms,
  formatOutOfStockMessage,
} = require('../services/sendSms');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const items = await InventoryItem.findAll();
    res.send(items);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await InventoryItem.findByPk(parseInt(id));
    if (!item) {
      return res.status(404).send('Inventory Item not found');
    }
    res.send(item);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const itemData = { ...req.body };

  try {
    const inventory = await Inventory.findByPk(itemData.inventory_id, {
      include: InventoryItem,
    });

    if (
      !inventory ||
      inventory.max_quantity <
        inventory.inventory_items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        ) +
          itemData.quantity
    ) {
      return res
        .status(412)
        .send('Inventory not found or max quantity exceeded');
    }

    const item = await InventoryItem.create(itemData);
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const itemData = { ...req.body };

  try {
    const inventory = await Inventory.findByPk(id, {
      include: InventoryItem,
    });

    if (
      !inventory ||
      inventory.max_quantity <
        inventory.inventory_items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        ) +
          itemData.quantity
    ) {
      return res
        .status(412)
        .send('Inventory not found or max quantity exceeded');
    }

    await InventoryItem.update(itemData, {
      where: { inventory_item_id: parseInt(id) },
    });
    const item = await InventoryItem.findByPk(parseInt(id));
    if (!item) {
      return res.status(404).send('Inventory Item not found');
    }

    const error = await checkInventoryItems(item.inventory_item_id);
    if (error) {
      sendSms(formatOutOfStockMessage(error), 'warning');
    }

    res.send(item);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await InventoryItem.destroy({
      where: { inventory_item_id: parseInt(id) },
    });
    if (!deleted) {
      return res.status(404).send('Inventory Item not found');
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
