'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const hasher = () => ({
  hash: async (data, rounds = 10) => {
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  },
  compare: async (data, hash) => {
    const compared = await bcrypt.compare(data, hash);
    return compared;
  },
});

const encryptor = (key) => ({
  encrypt: (str) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);

    const enc = cipher.update(str, 'utf-8');
    const enc2 = cipher.final();
    return Buffer.concat([enc, enc2, iv, cipher.getAuthTag()]).toString('base64');
  },

  decrypt: (data) => {
    const enc = Buffer.from(data, 'base64');
    const iv = enc.slice(enc.length - 28, enc.length - 16);
    const tag = enc.slice(enc.length - 16);
    const payload = enc.slice(0, enc.length - 28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
    decipher.setAuthTag(tag);
    const message = decipher.update(payload, null, 'utf8') + decipher.final('utf8');
    return message;
  },
});

module.exports = {
  hasher,
  encryptor,
};
