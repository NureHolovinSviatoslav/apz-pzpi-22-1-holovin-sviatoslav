'use strict';

const express = require('express');
const cors = require('cors');
const { router: vaccineRouter } = require('../routes/vaccine');
const { router: inventoryRouter } = require('../routes/inventory');
const { router: inventoryItemRouter } = require('../routes/inventoryItem');
const { router: locationRouter } = require('../routes/location');
const { router: notificationRouter } = require('../routes/notification');
const { router: orderRouter } = require('../routes/order');
const { router: sensorDataRouter } = require('../routes/sensorData');
const { router: userRouter } = require('../routes/user');
const { router: backupRouter } = require('../routes/backup');

const createServer = (port) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/vaccines', vaccineRouter);
  app.use('/inventories', inventoryRouter);
  app.use('/inventoryItems', inventoryItemRouter);
  app.use('/locations', locationRouter);
  app.use('/notifications', notificationRouter);
  app.use('/orders', orderRouter);
  app.use('/sensorData', sensorDataRouter);
  app.use('/users', userRouter);
  app.use('/backup', backupRouter);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

module.exports = {
  createServer,
};
