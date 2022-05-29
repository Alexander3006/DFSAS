'use strict';

const getHttpControllers = (container) => ({
  getFileController: require('./get-file.controller')(container),
  uploadFileController: require('./upload-file.controller')(container),
  getTempNonce: require('./get-nonce.controller')(container),
  deleteFileController: require('./delete-file.controller')(container),
});

module.exports = getHttpControllers;
