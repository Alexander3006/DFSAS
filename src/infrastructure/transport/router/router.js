'use strict';

const {HttpConnection} = require('../http/http.connection');
const {BaseEndpoint} = require('../interfaces/base.endpoint');
const {BaseRouterError, BaseRouter} = require('../interfaces/base.router');
const {TransportType, EndpointMethods} = require('../interfaces/constants');
const {WebSocketConnection} = require('../websocket/websocket.connection');

const DEFAULT_PATH = 'DEFAULD_PATH';

const TransportHandler = {
  [TransportType.HTTP]: (connection, payload) => {
    if (!(connection instanceof HttpConnection)) throw new RouterError('Invalid connection');
    const {method, path} = connection.route();
    return {method, path};
  },
  [TransportType.WebSocket]: (connection, payload) => {
    if (!(connection instanceof WebSocketConnection)) throw new RouterError('Invalid connection');
    const {event} = payload;
    return {
      method: EndpointMethods.WS,
      path: event,
    };
  },
};

class RouterError extends BaseRouterError {}

class Router extends BaseRouter {
  constructor() {
    super();
    this.storage = {};
  }

  async handle({connection, payload, metadata}) {
    const {transport} = metadata;
    const {method, path} = TransportHandler[transport](connection, payload);
    const endpoint = this.#searchEndpoint(method, path);
    if (!endpoint) return;
    const context = {payload, metadata};
    endpoint.execute({connection, context});
  }

  #searchEndpoint(method, path) {
    const {storage} = this;
    const methodStorage = storage[method];
    const endpoint = methodStorage?.get(path);
    //TODO: fix default endpoint
    const defaultEndpoint = {execute: () => {}};
    return endpoint ?? methodStorage?.get(DEFAULT_PATH) ?? defaultEndpoint;
  }

  registerEndpoint(endpoint) {
    const {storage} = this;
    if (!(endpoint instanceof BaseEndpoint)) throw new RouterError('Invalid endpoint');
    const {path, method} = endpoint;
    const methodStorage = storage[method] ?? new Map();
    methodStorage.set(path, endpoint);
    storage[method] = methodStorage;
    return this;
  }
}

module.exports = {
  Router,
  RouterError,
  DEFAULT_PATH,
};
