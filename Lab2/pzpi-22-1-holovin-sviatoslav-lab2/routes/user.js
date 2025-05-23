'use strict';

const { User } = require('../models/User');
const { Notification } = require('../models/Notification');
const express = require('express');
const { Order } = require('../models/Order');
const { hashString } = require('../services/hashString');
const jwtLib = require('jsonwebtoken');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { createSelfMiddleware } = require('../services/createSelfMiddleware');
const { roles } = require('../services/roles');

const router = express.Router();

const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
    });
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getOne = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findByPk(username, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const add = async (req, res) => {
  const userData = { ...req.body };

  try {
    const user = await User.create({
      ...userData,
      password_hash: hashString(userData.password),
    });
    res.status(201).send({
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const update = async (req, res) => {
  const { username } = req.params;
  const userData = { ...req.body };

  try {
    await User.update(userData, {
      where: { username },
    });
    const user = await User.findByPk(username, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const remove = async (req, res) => {
  const { username } = req.params;

  try {
    await Order.destroy({ where: { username } });
    const deleted = await User.destroy({
      where: { username },
    });
    if (!deleted) {
      return res.status(404).send('User not found');
    }
    res.status(204).send({});
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByPk(username);

    if (!user || user.password_hash !== hashString(password).toString()) {
      return res.status(401).send('Invalid username or password');
    }

    const accessToken = jwtLib.sign(
      {
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

router.get('/', ...createAuthMiddleware([roles.ADMIN, roles.DBO]), getAll);
router.get('/:username', ...createSelfMiddleware(), getOne);
router.post('/', ...createAuthMiddleware([roles.ADMIN, roles.DBO]), add);
router.patch(
  '/:username',
  ...createAuthMiddleware([roles.ADMIN, roles.DBO]),
  update,
);
router.delete(
  '/:username',
  ...createAuthMiddleware([roles.ADMIN, roles.DBO]),
  remove,
);
router.post('/login', login);

module.exports = { router };
