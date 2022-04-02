'use strict';

const {BaseConnection, BaseConnectionError} = require('../interfaces/base.connection');

class WebSocketConnectionError extends BaseConnectionError {}

class WebSocketConnection extends BaseConnection {
  constructor({socket, request}) {
    super();
    this.socket = socket;
    this.request = request;
    this.isAlive = true;
  }

  //route() {}

  // async payload() {}

  async send(data) {
    const {socket} = this;
    return socket.send(data);
  }

  async destroy() {
    const {socket} = this;
    return socket.terminate();
  }

  async ping() {
    const {socket} = this;
    return socket.ping();
  }

  async pong() {
    const {socket} = this;
    return socket.pong();
  }
}

module.exports = {
  WebSocketConnection,
  WebSocketConnectionError,
};
