'use strict';

const {v4: uuid} = require('uuid');
const fs = require('fs');

const {TransportType} = require('../interfaces/constants');
const {BaseServer, BaseServerError} = require('../interfaces/base.server');
const {HttpConnection} = require('./http.connection');

class HttpServerError extends BaseServerError {}

//router: {handle({connection: BaseConnection}): Promise<any>}
class HttpServer extends BaseServer {
  constructor({config, router}) {
    super({type: TransportType.HTTP});
    const isValid = HttpServer.validateConfig(config);
    if (!isValid) throw new HttpServerError('Invalid config');
    this.config = config;
    const {ssl} = config;
    const protocol = ssl ? require('https') : require('http');
    const params = ssl
      ? {
          cert: fs.readFileSync(ssl.cert),
          key: fs.readFileSync(ssl.key),
        }
      : {};
    this.connections = new Map();
    const listener = this.#listener.bind(this);
    const server = protocol.createServer(params, listener);
    this.server = server;
    this.router = router;
  }

  get clients() {
    const {connections} = this;
    return new Map(connections);
  }

  static validateConfig(config) {
    //TODO
    return true;
  }

  async #listener(req, res) {
    const {router, connections, transport} = this;
    const clientId = uuid();
    const connection = new HttpConnection({req, res});
    connections.set(clientId, connection);
    res.on('close', () => {
      connections.delete(clientId);
    });
    router.handle({
      connection,
      metadata: {
        transport,
        client: clientId,
      },
    });
  }

  start() {
    const {
      config: {port, address, ssl},
      server,
    } = this;
    server.listen(port, address, () => {
      console.log(`Start server ${ssl ? 'https' : 'http'}://${address}:${port}`);
    });
    return this;
  }

  async stop() {
    const {connections, server, config} = this;
    const {address, port, ssl} = config;
    for (const [clientId, connection] of connections.entries()) {
      await connection.destroy();
      connections.delete(clientId);
    }
    server.close(() => {
      console.log(`Closed server ${ssl ? 'https' : 'http'}://${address}:${port}`);
    });
    return this;
  }
}

module.exports = {
  HttpServer,
  HttpServerError,
};
