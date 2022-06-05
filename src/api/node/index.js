'use strict';

const getHttpControllers = require('./http');
const getWebSocketController = require('./ws');

const useHttpNodeApi = (container) => {
  const {foundFileCallbackController} = getHttpControllers(container);
  const {networkRouter} = container;
  networkRouter.registerEndpoint(foundFileCallbackController);
};

const useWebSocketNodeApi = (container) => {
  const {findFileByHashController, findFilesByNameController} = getWebSocketController(container);
  const {networkRouter} = container;
  networkRouter.registerEndpoint(findFileByHashController);
  networkRouter.registerEndpoint(findFilesByNameController);
};

module.exports = {
  useHttpNodeApi,
  useWebSocketNodeApi,
};
