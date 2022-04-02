'use strict';

const getWebSocketControllers = (container) => ({
  findFileController: require('./find-file.controller')(container),
});

module.exports = getWebSocketControllers;
