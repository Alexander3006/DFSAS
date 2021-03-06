'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {verifivationGuard} = require('../guards/verification.guard');

const getFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const {data, signature} = payload;
    const getFileByHashDTO = FindFileByHashDTO.fromRaw(data);
    //verification
    const message = getFileByHashDTO.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, getFileByHashDTO.address);
    //
    const fileStream = await fileService.getFileByHash(getFileByHashDTO);
    if (!fileStream) throw new Error('File not found or not available');
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
    method: EndpointMethods.POST,
    path: '/client/get-file',
    handler: getFileController.bind(null, container),
  });
