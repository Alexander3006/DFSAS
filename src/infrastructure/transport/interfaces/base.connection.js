'use strict';

class BaseConnectionError extends Error {}

class BaseConnection {
  constructor() {}

  async payload() {
    throw new BaseConnectionError('');
  }

  async send(data) {
    throw new BaseConnectionError('');
  }

  async destroy() {
    throw new BaseConnectionError('');
  }

  route() {
    throw new BaseServerError('');
  }
}

module.exports = {
  BaseConnection,
  BaseConnectionError,
};
