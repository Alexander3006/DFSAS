'use strict';

class BaseRouterError extends Error {}

class BaseRouter {
  constructor() {}

  async handle({connection, payload, metadata}) {
    const {transport: TransportType} = metadata;
    throw new BaseRouterError('');
  }
}

module.exports = {
  BaseRouter,
  BaseRouterError,
};
