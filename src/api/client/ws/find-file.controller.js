'use strict';

const {v4: uuid} = require('uuid');
const {WebSocketEndpoint} = require('../../../infrastructure/transport/router/websocket.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {RequestDTO} = require('../../../services/dto/network.dto');
const {SearchFileByHashDTO} = require('../../../services/dto/search.dto');
const {MemoryCache} = require('../../../system/memory-cache');
const {verifivationGuard} = require('../guards/verification.guard');

const FIND_FILE_TIME = 5 * 60 * 1000; //default 5 min

const findFileController = async (container, {connection, context}) => {
  const {NetworkConfig, searchService, memoryCache, pubsub} = container;
  try {
    const {
      payload: {data, signature},
      metadata: {client},
    } = context;
    //create dto and validation
    const findFileByHashDto = FindFileByHashDTO.fromRaw(data);
    //verifivation
    const message = findFileByHashDto.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, findFileByHashDto.address);
    //
    const requestDto = RequestDTO.fromRaw({
      requestId: uuid(),
      expirationTime: Date.now() + FIND_FILE_TIME,
      callbackUrl: `${NetworkConfig.http.callback}/node/file-found`,
    });
    const searchFileByHashDTO = SearchFileByHashDTO.fromRaw({
      request: requestDto,
      payload: findFileByHashDto,
    });
    //requestId - client set to cache
    await memoryCache.set(requestDto.requestId, client, FIND_FILE_TIME / 1000);
    const expiresEvent = MemoryCache.expiresEvent(requestDto.requestId);
    //on search finished
    await pubsub.sub(expiresEvent, async function onExpires() {
      await connection.send(
        JSON.stringify({
          event: 'FILE_SEARCH_FINISHED',
          payload: {
            hash: findFileByHashDto.hash,
            requestId: requestDto.requestId,
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
          hash: findFileByHashDto.hash,
          requestId: requestDto.requestId,
          expirationTime: requestDto.expirationTime,
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
