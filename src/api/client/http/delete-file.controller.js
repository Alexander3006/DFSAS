'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {FindFileByHashDTO} = require('../../../services/dto/file.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {verifivationGuard} = require('../guards/verification.guard');

const deleteFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const {data, signature} = payload;
    const findFileByHashDTO = FindFileByHashDTO.fromRaw(data);
    //verification
    const message = findFileByHashDTO.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, findFileByHashDTO.address);
    //
    await fileService.deleteFile(findFileByHashDTO);
    await connection.send(
      JSON.stringify({
        success: true,
      }),
    );
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
    path: '/client/delete-file',
    handler: deleteFileController.bind(null, container),
  });
