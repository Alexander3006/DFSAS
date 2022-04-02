'use strict';

const fs = require('fs');

const {FileStorage, FileStorageConfig} = require('./index');

//SETTINGS
const config = new FileStorageConfig({storage: './storage'});
const fileStorage = new FileStorage({config});
const file = '/root/dfsas/package-lock.json';

//TEST
const testChecksum = async (file) => {
  const checksum = await fileStorage.getChecksum({filepath: file});
  return checksum;
};

const testSaveFile = async (file, checksum) => {
  const readFileStream = fs.createReadStream(file);
  const result = await fileStorage.saveFile({checksum, readFileStream});
};

//RUNNER
(async () => {
  const checksum = await testChecksum(file);
  const result = await testSaveFile(file, checksum);
})();
