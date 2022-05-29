'use strict';

const assert = require('assert');

const SDK = require('../node-sdk/container');
const {existChecksum, account, fileSeed} = require('./parameters.test');

const downloadFileTest = async () => {
  console.log('Download file test starting');
  try {
    const readFileStream = await SDK.httpApiClient.getFile({
      checksum: existChecksum,
      secret: account.privateKey,
    });
    const chunks = [];
    for await (const chunk of readFileStream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString('utf-8');
    const matched = data.includes(fileSeed);

    assert.equal(matched, true, 'Downloaded file not matched with requested file');
    return;
  } catch (err) {
    console.log(err);
    throw new Error('Download file test error');
  } finally {
    console.log('Download file test completed');
  }
};

module.exports = {
  downloadFileTest,
};
