const {WebSocketEndpoint} = require('../../../infrastructure/transport/router/websocket.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {RequestDTO} = require('../../../services/dto/network.dto');
const {SearchFileByHashDTO} = require('../../../services/dto/search.dto');

const findFileController = async (container, {connection, context}) => {
  const {searchService} = container;
  try {
    const {
      payload: {data},
    } = context;
    const {request, payload} = data;
    const findFileByHashDto = FindFileByHashDTO.fromRaw(payload);
    const requestDto = RequestDTO.fromRaw(request);
    const searchFileByHashDTO = SearchFileByHashDTO.fromRaw({
      request: requestDto,
      payload: findFileByHashDto,
    });
    await searchService.searchFileByHash(searchFileByHashDTO);
    return;
  } catch (err) {
    console.log(err);
    connection.send(
      JSON.stringify({
        event: 'ERROR',
        request: context.payload.data.request,
        message: err?.message ?? '',
      }),
    );
  }
};

module.exports = (container) =>
  new WebSocketEndpoint({
    path: '/node/find-file',
    handler: findFileController.bind(null, container),
  });
