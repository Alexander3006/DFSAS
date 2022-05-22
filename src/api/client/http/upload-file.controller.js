'use strict';

const fs = require('fs');
const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {SaveFileDTO} = require('../../../services/dto/file.dto');
const {SignatureDTO} = require('../../../services/dto/signature.dto');
const {verifivationGuard} = require('../guards/verification.guard');

const uploadFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  const {files, data: body, clear} = await connection.multiform();
  try {
    const {
      file: {filepath},
    } = files;
    const payload = JSON.parse(body.payload);
    const {data, signature} = payload;
    const readFileStream = fs.createReadStream(filepath, 'utf-8');
    const saveFileDTO = SaveFileDTO.fromRaw({
      ...data,
      readFileStream,
    });
    //verification
    const message = saveFileDTO.toMessage();
    const signatureDTO = SignatureDTO.fromRaw({...signature, message});
    await verifivationGuard(container, signatureDTO, saveFileDTO.address);
    //
    const fileModel = await fileService.saveFile(saveFileDTO);
    await connection.send(
      JSON.stringify({
        success: true,
        result: fileModel,
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
  } finally {
    const filepaths = await clear();
    console.log(`Cleaned temp files: ${JSON.stringify(filepaths)}`);
  }
};

module.exports = (container) =>
  new HttpEndpoint({
    method: EndpointMethods.POST,
    path: '/client/upload-file',
    handler: uploadFileController.bind(null, container),
  });
