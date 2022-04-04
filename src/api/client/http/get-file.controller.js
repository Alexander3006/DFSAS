'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {verifivationGuard} = require('./guards/verification.guard');

const getFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const {data, signature} = payload;
    const getFileByHashDto = FindFileByHashDTO.fromRaw(data);
    //verification
    const message = getFileByHashDto.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, getFileByHashDto.address);
    //
    const fileStream = await fileService.getFileByHash(getFileByHashDto);
    if (!fileService) throw new Error('File not found or not available');
    await connection.send(fileStream);
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
