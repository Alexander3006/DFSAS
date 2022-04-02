'use strict';

const config = {
  ws: {
    address: '0.0.0.0',
    port: 4000,
    ssl: null,
    peers: [
      // 'ws://localhost:3000'
    ],
  },
  http: {
    address: '0.0.0.0',
    port: 4001,
    ssl: null,
    callback: 'http://0.0.0.0:4001',
  },
};

module.exports = config;
