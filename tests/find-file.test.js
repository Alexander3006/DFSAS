'use strict';

const assert = require('assert');

const SDK = require('../node-sdk/container');
const {wsApiClient, WS_EVENTS} = SDK;
const {existChecksum, account, wsNode} = require('./parameters.test');

const searchFileByHashTest = async () => {
  console.log('Search file by hash test starting');
  try {
    const files = [];
    const onFileFound = (payload) => files.push(payload);
    wsApiClient.connect(wsNode);
    wsApiClient.subscribe(WS_EVENTS.FILE_FOUND, onFileFound);
    const finish = new Promise((res, rej) => {
      function onSearchFinish() {
        wsApiClient.unsubscribe(WS_EVENTS.FILE_FOUND, onFileFound);
        wsApiClient.unsubscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
        wsApiClient.unsubscribe(WS_EVENTS.ERROR, onError);
        res(files);
      }
      function onError(_, err) {
        wsApiClient.unsubscribe(WS_EVENTS.FILE_FOUND, onFileFound);
        wsApiClient.unsubscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
        wsApiClient.unsubscribe(WS_EVENTS.ERROR, onError);
        console.dir(err);
        rej(err);
      }
      wsApiClient.subscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
      wsApiClient.subscribe(WS_EVENTS.ERROR, onError);
    });
    await wsApiClient.searchFileByHashRequest({
      hash: existChecksum,
      secret: account.privateKey,
      timeout: 1000,
    });
    const result = await finish;
    console.log(`Found files: ${result.length}`);
    const matched = !result.some(({file}) => file.hash !== existChecksum);
    assert.equal(matched, true, 'Found file does not matched with requested');
  } catch (err) {
    console.log(err);
    throw new Error('Search file by hash test error');
  } finally {
    console.log('Search file by hash test completed');
    wsApiClient.disconnect();
  }
};

const searchFileByNameTest = async () => {
  console.log('Search file by name test starting');
  const NAME = 'test_file';
  try {
    const files = [];
    wsApiClient.connect(wsNode);
    const onFileFound = (payload) => files.push(payload);
    wsApiClient.subscribe(WS_EVENTS.FILE_FOUND, onFileFound);
    wsApiClient.subscribe(WS_EVENTS.FILE_FOUND, onFileFound);
    const finish = new Promise((res, rej) => {
      function onSearchFinish() {
        wsApiClient.unsubscribe(WS_EVENTS.FILE_FOUND, onFileFound);
        wsApiClient.unsubscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
        wsApiClient.unsubscribe(WS_EVENTS.ERROR, onError);
        res(files);
      }
      function onError(_, err) {
        wsApiClient.unsubscribe(WS_EVENTS.FILE_FOUND, onFileFound);
        wsApiClient.unsubscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
        wsApiClient.unsubscribe(WS_EVENTS.ERROR, onError);
        console.dir(err);
        rej(err);
      }
      wsApiClient.subscribe(WS_EVENTS.FILE_SEARCH_FINISHED, onSearchFinish);
      wsApiClient.subscribe(WS_EVENTS.ERROR, onError);
    });
    await wsApiClient.searchFileByNameRequest({
      name: NAME,
      secret: account.privateKey,
      timeout: 1000,
    });
    const result = await finish;
    console.log(`Found files: ${result.length}`);
    const matched = !result.some(({file}) => !file.name.toLowerCase().includes(NAME.toLowerCase()));
    assert.equal(matched, true, 'Found file does not matched with requested');
  } catch (err) {
    console.log(err);
    throw new Error('Search file by name test error');
  } finally {
    console.log('Search file by name test completed');
    wsApiClient.disconnect();
  }
};

module.exports = {
  searchFileByHashTest,
  searchFileByNameTest,
};
