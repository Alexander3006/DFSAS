'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');

const getFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const getFileByHashDto = FindFileByHashDTO.fromRaw(payload);
    const fileStream = await fileService.getFileByHash(getFileByHashDto);
    if (!fileService) throw new Error('File not found or not available');
    await connection.send(fileService);
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
    path: '/client/get-file',
    handler: getFileController.bind(null, container),
  });
