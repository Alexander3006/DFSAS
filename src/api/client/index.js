'use strict';

const getWebSocketControllers = require('./ws');
const getHttpControllers = require('./http');

const useWebSocketClientApi = (container) => {
  const {findFileController} = getWebSocketControllers(container);
  const {apiRouter} = container;
  apiRouter.registerEndpoint(findFileController);
};

const useHttpClientApi = (container) => {
  const {getFileController, uploadFileController} = getHttpControllers(container);
  const {apiRouter} = container;
  apiRouter.registerEndpoint(getFileController);
  apiRouter.registerEndpoint(uploadFileController);
};

module.exports = {
  useHttpClientApi,
  useWebSocketClientApi,
};
