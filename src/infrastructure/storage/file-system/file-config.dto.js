'use strict';

class FileStorageConfig {
  constructor(config) {
    const valid = FileStorageConfig.validate(config);
    if (!valid) throw new Error('Invalid storage config');
    this.storage = config.storage;
  }

  static validate(config) {
    const {storage} = config;
    //TODO
    return true;
  }
}

module.exports = {
  FileStorageConfig,
};
