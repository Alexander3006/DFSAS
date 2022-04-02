'use strict';

const getHttpControllers = require('./http');
const getWebSocketController = require('./ws');

const useHttpNodeApi = (container) => {
  const {foundFileCallbackController} = getHttpControllers(container);
  const {networkRouter} = container;
  networkRouter.registerEndpoint(foundFileCallbackController);
};

const useWebSocketNodeApi = (container) => {
  const {findFileController} = getWebSocketController(container);
  const {networkRouter} = container;
  networkRouter.registerEndpoint(findFileController);
};

module.exports = {
  useHttpNodeApi,
  useWebSocketNodeApi,
};
