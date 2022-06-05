const {WebSocketEndpoint} = require('../../../infrastructure/transport/router/websocket.endpoint');
const {FindFilesByNameDTO} = require('../../../services/dto/file.dto');
const {RequestDTO} = require('../../../services/dto/network.dto');
const {SearchFilesByNameDTO} = require('../../../services/dto/search.dto');

const findFilesByNameController = async (container, {connection, context}) => {
  const {searchService} = container;
  try {
    const {
      payload: {data},
    } = context;
    const {request, payload} = data;
    const findFilesByNameDTO = FindFilesByNameDTO.fromRaw(payload);
    const requestDto = RequestDTO.fromRaw(request);
    const searchFilesByHashDTO = SearchFilesByNameDTO.fromRaw({
      request: requestDto,
      payload: findFilesByNameDTO,
    });
    await searchService.searchFilesByName(searchFilesByHashDTO);
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
    path: 'FIND_FILES_BY_NAME',
    handler: findFilesByNameController.bind(null, container),
  });
