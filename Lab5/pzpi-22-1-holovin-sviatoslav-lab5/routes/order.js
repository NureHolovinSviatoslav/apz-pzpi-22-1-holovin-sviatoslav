'use strict';

const { Order } = require('../models/Order');
const { OrderItem } = require('../models/OrderItem');
const { Vaccine } = require('../models/Vaccine');
const express = require('express');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { roles } = require('../services/roles');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Vaccine],
        },
      ],
    });
    res.send(orders);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(parseInt(id), {
      include: [
        {
          model: OrderItem,
          include: [Vaccine],
        },
      ],
    });
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.send(order);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const { username, items, order_status } = req.body;

  try {
    const order = await Order.create(
      { username, order_date: new Date(), order_status },
      { include: [OrderItem] },
    );

    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.order_id,
        vaccine_id: item.vaccine_id,
        quantity: item.quantity,
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    const newOrder = await Order.findByPk(order.order_id, {
      include: [OrderItem],
    });

    res.status(201).send(newOrder);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const order = await Order.findByPk(parseInt(id));
    if (!order) {
      return res.status(404).send('Order not found');
    }

    await Order.update(
      { ...order, order_status: req.body.order_status },
      { where: { order_id: parseInt(id) } },
    );

    if (items && items.length > 0) {
      await OrderItem.destroy({ where: { order_id: id } });

      const orderItems = items.map((item) => ({
        order_id: id,
        vaccine_id: item.vaccine_id,
        quantity: item.quantity,
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    const updatedOrder = await Order.findByPk(id, {
      include: [OrderItem],
    });

    res.send(updatedOrder);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    await OrderItem.destroy({ where: { order_id: parseInt(id) } });
    const deleted = await Order.destroy({
      where: { order_id: parseInt(id) },
    });
    if (!deleted) {
      return res.status(404).send('Order not found');
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
