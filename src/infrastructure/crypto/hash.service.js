'use strict';

const bcrypt = require('bcrypt');

class HashService {
  constructor() {}

  async hash(data, rounds = 10) {
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  }

  async compare(data, hash) {
    const compared = await bcrypt.compare(data, hash);
    return compared;
  }
}

module.exports = {
  HashService,
};
