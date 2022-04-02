'use strict';

class BaseServerError extends Error {}

class BaseServer {
  constructor({type}) {
    this.transport = type;
  }

  static validateConfig() {
    throw new BaseServerError('');
  }

  async start() {
    throw new BaseServerError('');
  }

  async stop() {
    throw new BaseServerError('');
  }

  get clients() {
    throw new BaseServerError('');
  }
}

module.exports = {
  BaseServer,
  BaseServerError,
};
