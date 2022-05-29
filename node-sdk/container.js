'use strict';

const {SignatureService} = require('../src/infrastructure/crypto/signature.service');
const signatureService = new SignatureService();

const {HttpApiClient} = require('./http-api.client');
const httpApiClient = new HttpApiClient({signatureService});

const {WsApiClient, WS_EVENTS} = require('./ws-api.client');
const wsApiClient = new WsApiClient({signatureService, httpApiClient});

const {FileAccessType} = require('../src/models/owner.model');

const SDK = {
  wsApiClient,
  httpApiClient,
  signatureService,
  FileAccessType,
  WS_EVENTS,
};

module.exports = SDK;
