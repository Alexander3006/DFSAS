'use strict';

const assert = require('assert');
const fs = require('fs');
const SDK = require('../node-sdk/container');

const {account, testFilePath, fileSeed} = require('./parameters.test');
const {rm, generateLargeFile, getChecksum} = require('./helpers.test');

const uploadFileTest = async () => {
  console.log('Upload file test starting');
  const path = testFilePath();
  try {
    await generateLargeFile(path, fileSeed);
    const checksum = await getChecksum(path);
    const readStream = fs.createReadStream(path);
    const result = await SDK.httpApiClient.uploadFile({
      name: 'TEST_FILE_NAME',
      ttl: 99999,
      checksum: checksum,
      accessType: SDK.FileAccessType.OPEN,
      file: readStream,
      secret: account.privateKey,
    });
    const {name, hash} = result;
    assert.deepEqual(
      {name, hash},
      {name: 'TEST_FILE_NAME', hash: checksum},
      'Upload file error: response does not match request',
    );
    return true;
  } catch (err) {
    console.log(err);
    throw new Error('Upload file test error');
  } finally {
    await rm(path);
    console.log('Upload file test completed');
  }
};

module.exports = {
  uploadFileTest,
};
