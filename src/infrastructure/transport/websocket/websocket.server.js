'use strict';

const WS = require('ws');
const fs = require('fs');
const {v4: uuid} = require('uuid');

const {TransportType} = require('../interfaces/constants');
const {BaseServer, BaseServerError} = require('../interfaces/base.server');
const {WebSocketConnection} = require('./websocket.connection');

class WebSocketServerError extends BaseServerError {}

class WebSocketServer extends BaseServer {
  constructor({config, router}) {
    super({type: TransportType.WebSocket});
    const isValid = WebSocketServer.validateConfig(config);
    if (!isValid) throw new HttpServerError('Invalid config');
    this.config = config;
    this.router = router;
    const {ssl} = config;
    const protocol = ssl ? require('https') : require('http');
    const params = ssl
      ? {
          cert: fs.readFileSync(ssl.cert),
          key: fs.readFileSync(ssl.key),
        }
      : {};
    this.connections = new Map();
    const http = protocol.createServer(params);
    this.server = http;
    const ws = new WS.Server({
      server: http,
      clientTracking: false,
    });
    ws.on('connection', this.#onConnection.bind(this))
      .on('close', this.#onClose.bind(this))
      .on('error', this.#onError.bind(this));
    this.pingInterval = this.#ping();
  }

  get clients() {
    const {connections} = this;
    return new Map(connections);
  }

  getClient(clientId) {
    const {connections} = this;
    const client = connections.get(clientId);
    return client;
  }

  async #onConnection(socket, request) {
    const {connections, router, transport} = this;
    const connection = new WebSocketConnection({socket, request});
    const clientId = uuid();
    console.log(`WS: connected: ${clientId}`);
    connections.set(clientId, connection);
    socket.on('close', (_) => {
      console.log(`WS: disconnected: ${clientId}`);
      connections.delete(clientId);
    });
    socket.on('pong', () => (connection.isAlive = true));
    socket.on('message', async (message) => {
      if (!router) return;
      const payload = JSON.parse(message);
      router.handle({connection, payload, metadata: {transport, client: clientId}});
    });
  }

  #ping() {
    const {connections} = this;
    const ping = () => {
      connections.forEach(async (connection) => {
        if (connection.isAlive === false) await connection.destroy();
        connection.isAlive = false;
        await connection.ping();
      });
    };
    const interval = setInterval(ping, 30000);
    return interval;
  }

  async #onClose() {
    const {connections, pingInterval} = this;
    clearInterval(pingInterval);
    for (const [clientId, connection] of connections.entries()) {
      await connection.destroy();
      connections.delete(clientId);
    }
    return;
  }

  async #onError(err) {
    console.log(err);
    return;
  }

  static validateConfig(config) {
    //TODO
    return true;
  }

  async start() {
    const {config, server} = this;
    const {ssl, port, address} = config;
    server.listen(port, address, () => {
      console.log(`Start WebSocket server ${ssl ? 'wss' : 'ws'}://${address}:${port}`);
    });
    return this;
  }

  async stop() {
    const {server, config} = this;
    const {ssl, port, address} = config;
    server.close(() => {
      console.log(`WebSocket server ${ssl ? 'wss' : 'ws'}://${address}:${port} closed`);
    });
    return this;
  }
}

module.exports = {
  WebSocketServer,
  WebSocketServerError,
};
