'use strict';

const {BaseEndpointError, BaseEndpoint} = require('../interfaces/base.endpoint');
const {EndpointMethods} = require('../interfaces/constants');

class WebSocketEndpointError extends BaseEndpointError {}

class WebSocketEndpoint extends BaseEndpoint {
  constructor({path, handler}) {
    super({method: EndpointMethods.WS, path, handler});
  }
}

module.exports = {
  WebSocketEndpoint,
  WebSocketEndpointError,
};
