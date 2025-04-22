'use strict';

const { Notification } = require('../models/Notification');
const express = require('express');
const { roles } = require('../services/roles');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.send(notifications);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(parseInt(id));
    if (!notification) {
      return res.status(404).send('Notification not found');
    }
    res.send(notification);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const notificationData = { ...req.body };

  try {
    const notification = await Notification.create(notificationData);
    res.status(201).send(notification);
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
router.post('/', ...createAuthMiddleware([roles.ADMIN, roles.DBO]), add);

module.exports = { router };
