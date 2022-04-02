'use strict';

const WS = require('ws');
const {v4: uuid} = require('uuid');

const {TransportType} = require('../interfaces/constants');
const {WebSocketConnection} = require('./websocket.connection');

class WebSocketClientError extends Error {}

class WebSocketClient {
  constructor({router}) {
    this.router = router;
    this.transport = TransportType.WebSocket;
    this.connections = new Map();
  }

  async connect({url}) {
    const {connections, router, transport} = this;
    const socket = new WS(url);
    const connection = new WebSocketConnection({socket, request: {}});
    const serverId = uuid();
    connections.set(serverId, connection);
    //heartbeat
    let pingTimeout;
    const heartbeat = () => {
      clearTimeout(pingTimeout);
      pingTimeout = setTimeout(async () => {
        await connection.destroy();
      }, 31000);
    };
    socket.on('open', heartbeat);
    socket.on('ping', heartbeat);
    //
    socket.on('close', async (_) => {
      clearTimeout(pingTimeout);
      connections.delete(serverId);
    });
    socket.on('message', async (message) => {
      if (!router) return;
      const payload = JSON.parse(message);
      router.handle({connection, payload, metadata: {transport, client: serverId}});
    });
    return connection;
  }

  get clients() {
    const {connections} = this;
    return new Map(connections);
  }

  getClient(serverId) {
    const {connections} = this;
    const client = connections.get(serverId);
    return client;
  }

  async stop() {
    const {connections} = this;
    for (const [serverId, connection] of connections.entries()) {
      await connection.destroy();
      connections.delete(serverId);
    }
    return;
  }
}

module.exports = {
  WebSocketClient,
  WebSocketClientError,
};
