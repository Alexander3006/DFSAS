'use strict';

const {useHttpNodeApi, useWebSocketNodeApi} = require('./src/api/node');
const {useHttpClientApi, useWebSocketClientApi} = require('./src/api/client');
const container = require('./container');

(async () => {
  //register node api
  useHttpNodeApi(container);
  useWebSocketNodeApi(container);
  //register client api
  useHttpClientApi(container);
  useWebSocketClientApi(container);
  //start application
  await container.start();
  //graceful shutdown appilication
  const shutdown = async () => {
    await container.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
