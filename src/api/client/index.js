'use strict';

const getWebSocketControllers = require('./ws');
const getHttpControllers = require('./http');

const useWebSocketClientApi = (container) => {
  const {findFileByHashController, findFilesByNameController} = getWebSocketControllers(container);
  const {apiRouter} = container;
  apiRouter.registerEndpoint(findFileByHashController);
  apiRouter.registerEndpoint(findFilesByNameController);
};

const useHttpClientApi = (container) => {
  const {getFileController, uploadFileController, getTempNonce, deleteFileController} =
    getHttpControllers(container);
  const {apiRouter} = container;
  apiRouter.registerEndpoint(getTempNonce);
  apiRouter.registerEndpoint(getFileController);
  apiRouter.registerEndpoint(uploadFileController);
  apiRouter.registerEndpoint(deleteFileController);
};

module.exports = {
  useHttpClientApi,
  useWebSocketClientApi,
};
