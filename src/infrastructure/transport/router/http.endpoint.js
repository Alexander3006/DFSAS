'use strict';

const {BaseEndpointError, BaseEndpoint} = require('../interfaces/base.endpoint');
const {EndpointMethods} = require('../interfaces/constants');

const SUPPORTED_METHODS = [EndpointMethods.GET, EndpointMethods.POST];

class HttpEndpointError extends BaseEndpointError {}

class HttpEndpoint extends BaseEndpoint {
  constructor({method, path, handler}) {
    if (!SUPPORTED_METHODS.includes(method)) throw new HttpEndpointError('Method not supported');
    super({method, path, handler});
  }
}

module.exports = {
  HttpEndpoint,
  HttpEndpointError,
};
