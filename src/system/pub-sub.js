'use strict';

const {EventEmitter} = require('events');

class PubSubError extends Error {}

class PubSub {
  constructor() {
    this.ee = new EventEmitter();
  }

  async sub(key, listener) {
    const {ee} = this;
    ee.on(key, listener);
    return true;
  }

  async pub(key, value) {
    const {ee} = this;
    ee.emit(key, value);
    return true;
  }

  async unsub(key, listener) {
    const {ee} = this;
    ee.off(key, listener);
    return true;
  }
}

module.exports = {
  PubSub,
  PubSubError,
};
