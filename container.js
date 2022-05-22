'use strict';

//configs
const {NetworkConfig, FileStorageConfig, ApiConfig, NodeInfo} = require('./src/config');

//crypto
const {EncryptionService} = require('./src/infrastructure/crypto/encryption.service');
const {HashService} = require('./src/infrastructure/crypto/hash.service');
const {SignatureService} = require('./src/infrastructure/crypto/signature.service');

const signatureService = new SignatureService();
const hashService = new HashService();
const encryptionService = new EncryptionService();

//transport
const {WebSocketClient} = require('./src/infrastructure/transport/websocket/websocket.client');
const {WebSocketServer} = require('./src/infrastructure/transport/websocket/websocket.server');
const {HttpServer} = require('./src/infrastructure/transport/http/http.server');
const {Router} = require('./src/infrastructure/transport/router/router');

//system
const {MemoryCache} = require('./src/system/memory-cache');
const {PubSub} = require('./src/system/pub-sub');
const pubsub = new PubSub();
const memoryCache = new MemoryCache({pubsub});

//storage
const {FileStorage} = require('./src/infrastructure/storage/file-system');
const fileStorage = new FileStorage({config: FileStorageConfig});

const {
  connection: dbConnection,
} = require('./src/infrastructure/storage/database/connections/main.connection');
const {UnitOfWork} = require('./src/infrastructure/storage/database/unit-of-work');
const models = require('./src/models');
const unitOfWork = new UnitOfWork({models, connection: dbConnection});
const db = {unitOfWork};

//network
const networkRouter = new Router();
const networkWebsocketServer = new WebSocketServer({
  router: networkRouter,
  config: NetworkConfig.ws,
});
const networkHttpServer = new HttpServer({router: networkRouter, config: NetworkConfig.http});
const networkWebsocketClientManager = new WebSocketClient({router: networkRouter});

//access
const {VerificationService} = require('./src/services/verification.service');
const verificationService = new VerificationService({memoryCache, signatureService});

//api
const apiRouter = new Router();
const apiWebsocketServer = new WebSocketServer({
  router: apiRouter,
  config: ApiConfig.ws,
});
const apiHttpServer = new HttpServer({router: apiRouter, config: ApiConfig.http});

//services
const {NetworkService} = require('./src/services/network.service');
const networkService = new NetworkService({
  config: NetworkConfig,
  node: NodeInfo,
  networkWebsocketClientManager,
  memoryCache,
});
const {FileService} = require('./src/services/file.service');
const fileService = new FileService({db, fileStorage});
const {SearchService} = require('./src/services/search.service');
const searchService = new SearchService({fileService, networkService});

const container = {
  //configs
  NetworkConfig,
  //system
  pubsub,
  memoryCache,
  //storage
  db,
  fileStorage,
  //crypto
  signatureService,
  //network
  networkRouter,
  networkHttpServer,
  networkWebsocketServer,
  networkWebsocketClientManager,
  //access
  verificationService,
  //api
  apiRouter,
  apiHttpServer,
  apiWebsocketServer,
  //services
  fileService,
  networkService,
  searchService,

  start: () =>
    Promise.all([
      networkHttpServer.start(),
      networkWebsocketServer.start(),
      networkService.start(),
      apiHttpServer.start(),
      apiWebsocketServer.start(),
    ]),

  stop: () =>
    Promise.allSettled([
      networkHttpServer.stop(),
      networkWebsocketServer.stop(),
      networkWebsocketClientManager.stop(),
      apiHttpServer.stop(),
      apiWebsocketServer.stop(),
    ]),
};

module.exports = container;
