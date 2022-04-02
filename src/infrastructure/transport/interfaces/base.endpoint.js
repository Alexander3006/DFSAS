'use strict';

class BaseEndpointError extends Error {}

class BaseEndpoint {
  constructor({method, path, handler}) {
    this.path = path;
    this.method = method;
    this.handler = handler;
  }

  async execute({connection, context}) {
    const {handler} = this;
    return await handler({connection, context});
  }
}

module.exports = {
  BaseEndpoint,
  BaseEndpointError,
};
