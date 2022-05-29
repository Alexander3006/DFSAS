'use strict';

const getWebSocketControllers = (container) => ({
  findFileByHashController: require('./find-file-by-hash.controller')(container),
  findFilesByNameController: require('./find-files-by-name.controller')(container),
});

module.exports = getWebSocketControllers;
