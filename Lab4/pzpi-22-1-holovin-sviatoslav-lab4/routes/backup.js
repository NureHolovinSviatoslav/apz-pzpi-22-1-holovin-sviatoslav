const express = require('express');
const { sequelize } = require('../services/db');
const { encrypt, decrypt } = require('../services/secureText');
const { createAuthMiddleware } = require('../services/createAuthMiddleware');
const { roles } = require('../services/roles');

const json = express.json({ limit: '150mb' });
const router = express.Router();

function topo(models) {
  const byTable = Object.fromEntries(models.map((m) => [m.getTableName(), m]));

  const graph = new Map();
  models.forEach((m) => {
    const deps = new Set();

    Object.values(m.rawAttributes).forEach((attr) => {
      const ref = attr.references?.model;
      if (!ref) return;

      const target = typeof ref === 'string' ? byTable[ref] : ref;

      if (target && target !== m) deps.add(target.name);
    });

    graph.set(m.name, deps);
  });

  const ordered = [];
  const temp = new Set();

  function dfs(name) {
    if (ordered.includes(name)) return;
    if (temp.has(name)) return;
    temp.add(name);
    graph.get(name).forEach(dfs);
    temp.delete(name);
    ordered.push(name);
  }

  [...graph.keys()].forEach(dfs);
  return ordered.map((n) => models.find((m) => m.name === n));
}

async function exp(req, res) {
  const { password } = req.body || {};
  if (!password) return res.status(400).send('password required');

  const models = topo(Object.values(sequelize.models));
  const dump = {};
  for (const m of models) dump[m.name] = await m.findAll({ raw: true });

  const encrypted = encrypt(JSON.stringify(dump), password);
  res.json({ db: encrypted });
}

async function imprt(req, res) {
  const { password, data } = req.body || {};
  if (!password || !data)
    return res.status(400).send('password and data required');
  let payload;
  try {
    payload = JSON.parse(decrypt(data, password));
  } catch {
    return res.status(400).send('invalid password or corrupted data');
  }
  const models = topo(Object.values(sequelize.models));
  const rev = [...models].reverse();
  await sequelize.transaction(async (t) => {
    for (const m of rev)
      await m.destroy({ truncate: true, cascade: true, transaction: t });
    for (const m of models)
      await m.bulkCreate(payload[m.name] || [], {
        validate: true,
        transaction: t,
      });
  });
  res.send('restored');
}

router.post('/import', ...createAuthMiddleware([roles.DBO]), imprt);
router.post('/export', ...createAuthMiddleware([roles.DBO]), exp);

module.exports = { router };
