'use strict';

const {v4: uuid} = require('uuid');
const {WebSocketEndpoint} = require('../../../infrastructure/transport/router/websocket.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {RequestDTO} = require('../../../services/dto/network.dto');
const {SearchFileByHashDTO} = require('../../../services/dto/search.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {MemoryCache} = require('../../../system/memory-cache');
const {verifivationGuard} = require('../guards/verification.guard');

const FIND_FILE_TIME = 5 * 60 * 1000; //default 5 min

const findFileController = async (container, {connection, context}) => {
  const {NetworkConfig, searchService, memoryCache, pubsub} = container;
  try {
    const {
      payload: {payload},
      metadata: {client},
    } = context;
    const {signature, data, timeout} = JSON.parse(payload);
    //create dto and validation
    const findFileByHashDTO = FindFileByHashDTO.fromRaw(data);
    //verifivation
    const message = findFileByHashDTO.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, findFileByHashDTO.address);
    //
    const requestDTO = RequestDTO.fromRaw({
      requestId: uuid(),
      expirationTime: Date.now() + (timeout ?? FIND_FILE_TIME),
      callbackUrl: `${NetworkConfig.http.callback}/node/file-found`,
    });
    const searchFileByHashDTO = SearchFileByHashDTO.fromRaw({
      request: requestDTO,
      payload: findFileByHashDTO,
    });
    //requestId - client set to cache
    await memoryCache.set(requestDTO.requestId, client, (timeout ?? FIND_FILE_TIME) / 1000);
    const expiresEvent = MemoryCache.expiresEvent(requestDTO.requestId);
    //on search finished
    await pubsub.sub(expiresEvent, async function onExpires() {
      await connection.send(
        JSON.stringify({
          event: 'FILE_SEARCH_FINISHED',
          payload: {
            hash: findFileByHashDTO.hash,
            requestId: requestDTO.requestId,
          },
        }),
      );
      await pubsub.unsub(expiresEvent, onExpires);
    });
    //start search
    await searchService.searchFileByHash(searchFileByHashDTO);
    //send search data
    await connection.send(
      JSON.stringify({
        event: 'FILE_SEARCH_STARTED',
        payload: {
          hash: findFileByHashDTO.hash,
          requestId: requestDTO.requestId,
          expirationTime: requestDTO.expirationTime,
        },
      }),
    );
    return;
  } catch (err) {
    console.log(err);
    connection.send(
      JSON.stringify({
        event: 'ERROR',
        message: err?.message ?? '',
      }),
    );
  }
};

module.exports = (container) =>
  new WebSocketEndpoint({
    path: 'FIND_FILE_BY_HASH',
    handler: findFileController.bind(null, container),
  });
