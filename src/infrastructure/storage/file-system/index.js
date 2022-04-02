'use strict';

const {FileStorageConfig} = require('./file-config.dto');
const {FileStorage, FileStorageError} = require('./file-storage.service');

module.exports = {
  FileStorage,
  FileStorageError,
  FileStorageConfig,
};
