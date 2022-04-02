'use strict';

const getHttpControllers = (container) => ({
  getFileController: require('./get-file.controller')(container),
  uploadFileController: require('./upload-file.controller')(container),
});

module.exports = getHttpControllers;
