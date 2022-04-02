'use strict';

class MemoryCacheError extends Error {}

class MemoryCache {
  constructor({pubsub = null}) {
    this.storage = new Map();
    this.pubsub = pubsub;
  }

  static expiresEvent = (key) => `@key_expires:${key}`;

  set(key, value, expiry = false) {
    const {storage, pubsub} = this;
    if (!!expiry) {
      const timeout = parseInt(expiry) * 1000; //sec
      if (Number.isNaN(timeout)) throw new MemoryCacheError('Invalid expiry');
      setTimeout(async () => {
        storage.delete(key);
        if (!pubsub) return;
        const event = MemoryCache.expiresEvent(key);
        pubsub.pub(event, value);
      }, timeout);
    }
    storage.set(key, value);
    return true;
  }

  get(key) {
    const {storage} = this;
    const value = storage.get(key);
    return value;
  }
}

module.exports = {
  MemoryCache,
  MemoryCacheError,
};
