'use strict';

const assert = require('assert');

const SDK = require('../node-sdk/container');
const {existChecksum, account} = require('./parameters.test');

const deleteFileTest = async () => {
  console.log('Delete file test starting');
  try {
    const success = await SDK.httpApiClient.deleteFile({
      checksum: existChecksum,
      secret: account.privateKey,
    });
    assert.equal(typeof success, 'boolean', 'Unexpected response');
    return;
  } catch (err) {
    console.log(err);
    throw new Error('Delete file test error');
  } finally {
    console.log('Delete file test completed');
  }
};

module.exports = {
  deleteFileTest,
};
