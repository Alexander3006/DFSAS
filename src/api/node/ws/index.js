'use strict';

const getWebSocketController = (container) => ({
  findFileByHashController: require('./find-file-hash.controller')(container),
  findFilesByNameController: require('./find-files-name.controller')(container),
});

module.exports = getWebSocketController;
