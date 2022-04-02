'use strict';

const fs = require('fs');
const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');
const {SaveFileDTO} = require('../../../services/dto/file.dto');

const uploadFileController = async (container, {connection, context}) => {
  const {fileService} = container;
  const {files, data, clear} = await connection.multiform();
  try {
    const {
      file: {filepath},
    } = files;
    const readFileStream = fs.createReadStream(filepath, 'utf-8');
    const payload = JSON.parse(data.payload);
    const saveFileDTO = SaveFileDTO.fromRaw({
      ...payload,
      readFileStream,
    });
    const fileModel = await fileService.saveFile(saveFileDTO);
    await connection.send(JSON.stringify(fileModel));
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
