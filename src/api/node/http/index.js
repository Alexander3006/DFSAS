'use strict';

const getHttpControllers = (container) => ({
  foundFileCallbackController: require('./found-file.controller')(container),
});

module.exports = getHttpControllers;
