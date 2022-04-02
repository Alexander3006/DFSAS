'use strict';

const getWebSocketController = (container) => ({
  findFileController: require('./find-file.controller')(container),
});

module.exports = getWebSocketController;
