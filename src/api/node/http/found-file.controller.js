'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {SearchFileResponseDTO} = require('../../../services/dto/search.dto');

const foundFileCallbackController = async (container, {connection, context}) => {
  const {memoryCache, apiWebsocketServer} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const {requestId, payload: file, nodeInfo} = SearchFileResponseDTO.fromRaw(payload);
    const clientId = await memoryCache.get(requestId);
    if (clientId) {
      const socket = apiWebsocketServer.getClient(clientId);
      if (socket) {
        await socket.send(
          JSON.stringify({
            event: 'FILE_FOUND',
            payload: {
              file,
              node: nodeInfo,
            },
          }),
        );
      }
    }
    await connection.send(JSON.stringify({success: true}));
    return;
  } catch (err) {
    console.log(err);
    await connection.send(
      JSON.stringify({
        success: false,
        message: err?.message ?? '',
      }),
    );
  }
};

module.exports = (container) =>
  new HttpEndpoint({
    method: EndpointMethods.GET,
    path: '/node/file-found',
    handler: foundFileCallbackController.bind(null, container),
  });
