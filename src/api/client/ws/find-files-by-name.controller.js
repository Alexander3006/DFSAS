'use strict';

const {v4: uuid} = require('uuid');
const {WebSocketEndpoint} = require('../../../infrastructure/transport/router/websocket.endpoint');
const {FindFilesByNameDTO} = require('../../../services/dto/file.dto');
const {RequestDTO} = require('../../../services/dto/network.dto');
const {SearchFilesByNameDTO} = require('../../../services/dto/search.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {MemoryCache} = require('../../../system/memory-cache');
const {verifivationGuard} = require('../guards/verification.guard');

const FIND_FILE_TIME = 5 * 60 * 1000; //default 5 min

const findFilesController = async (container, {connection, context}) => {
  const {NetworkConfig, searchService, memoryCache, pubsub} = container;
  try {
    const {
      payload: {payload},
      metadata: {client},
    } = context;
    const {signature, data, timeout} = JSON.parse(payload);
    //create dto and validation
    const findFilesByNameDTO = FindFilesByNameDTO.fromRaw(data);
    //verifivation
    const message = findFilesByNameDTO.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, findFilesByNameDTO.address);
    //
    const requestDTO = RequestDTO.fromRaw({
      requestId: uuid(),
      expirationTime: Date.now() + (timeout ?? FIND_FILE_TIME),
      callbackUrl: `${NetworkConfig.http.callback}/node/file-found`,
    });
    const searchFilesByNameDTO = SearchFilesByNameDTO.fromRaw({
      request: requestDTO,
      payload: findFilesByNameDTO,
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
            name: findFilesByNameDTO.name,
            requestId: requestDTO.requestId,
          },
        }),
      );
      await pubsub.unsub(expiresEvent, onExpires);
    });
    //start search
    await searchService.searchFilesByName(searchFilesByNameDTO);
    //send search data
    await connection.send(
      JSON.stringify({
        event: 'FILE_SEARCH_STARTED',
        payload: {
          name: findFilesByNameDTO.name,
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
    path: 'FIND_FILES_BY_NAME',
    handler: findFilesController.bind(null, container),
  });
