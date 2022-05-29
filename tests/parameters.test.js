'use strict';

const {v4: uuid} = require('uuid');

const account = {
  privateKey: 'dfe8cd69229801241ba5d49fd09ab8a3f4603237a8583ec33a8a4166b0f77916',
  publicKey: 'd4a6039691333d9c640ae842826f73f11c5d4b3f5f5384e95114ab0a18e6b31d',
  address: 'af1b1499ee6be45b5cb383cd407444ce',
};

const testFilePath = () => `./test-${uuid()}`;

const fileSeed = 'GENERATED LARGE FILE FOR TEST\n';

const existChecksum = 'wVDbEE_JslzfpcTlRoeL7Q';

const wsNode = 'ws://localhost:5000';

module.exports = {
  account,
  testFilePath,
  fileSeed,
  existChecksum,
  wsNode,
};
