const crypto = require('crypto');

const SALT = 16;
const IV = 12;
const KEY = 32;
const ITER = 100000;
const ALG = 'aes-256-gcm';

const derive = (pwd, salt) => crypto.pbkdf2Sync(pwd, salt, ITER, KEY, 'sha512');

const encrypt = (plain, pwd) => {
  const salt = crypto.randomBytes(SALT);
  const iv = crypto.randomBytes(IV);
  const key = derive(pwd, salt);
  const c = crypto.createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  const tag = c.getAuthTag();
  return Buffer.concat([salt, iv, tag, enc]).toString('base64');
};

const decrypt = (b64, pwd) => {
  const buf = Buffer.from(b64, 'base64');
  const salt = buf.slice(0, SALT);
  const iv = buf.slice(SALT, SALT + IV);
  const tag = buf.slice(SALT + IV, SALT + IV + 16);
  const data = buf.slice(SALT + IV + 16);
  const key = derive(pwd, salt);
  const d = crypto.createDecipheriv(ALG, key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString('utf8');
};

module.exports = { encrypt, decrypt };
