'use strict';

const {default: axios} = require('axios');
const {RequestDTO} = require('./dto/network.dto');
const {NodeInfoDTO} = require('./dto/node-info.dto');

class NetworkServiceError extends Error {}

class NetworkService {
  constructor({config, node, networkWebsocketClientManager, memoryCache}) {
    this.config = config;
    this.node = node;
    this.memoryCache = memoryCache;
    this.networkWebsocketClientManager = networkWebsocketClientManager;
  }

  async start() {
    const {config, networkWebsocketClientManager} = this;
    const {
      ws: {peers},
    } = config;
    await Promise.all(peers.map((peer) => networkWebsocketClientManager.connect({url: peer})));
    return this;
  }

  static broadcastKey(requestId) {
    return `broadcast_to_peers:${requestId}`;
  }

  async broadcastRequestToPeers(path, requestDTO, payload) {
    const {networkWebsocketClientManager, memoryCache} = this;
    if (!(requestDTO instanceof RequestDTO)) throw new NetworkServiceError('Invalid request');
    const {requestId, expirationTime} = requestDTO;
    try {
      const currentTime = Date.now();
      const timeDiff = expirationTime - currentTime;
      if (timeDiff <= 0) return;
      const key = NetworkService.broadcastKey(requestDTO);
      const isCyclicalReq = await memoryCache.get(key);
      if (!!isCyclicalReq) return;
      await memoryCache.set(key, requestId, timeDiff / 1000);
      const peers = networkWebsocketClientManager?.clients ?? new Map();
      const broadcastData = JSON.stringify({
        event: path,
        data: {
          request: requestDTO,
          payload: payload,
        },
      });
      await Promise.allSettled([...peers.values()].map((peer) => peer.send(broadcastData)));
      return;
    } catch (err) {
      console.log(err);
      throw new NetworkServiceError('Broadcast to peers error');
    }
  }

  async callback(requestDTO, payload) {
    const {node} = this;
    try {
      const nodeInfo = NodeInfoDTO.fromRaw({...node});
      const {requestId, callbackUrl} = requestDTO;
      const {data} = await axios.post(callbackUrl, {payload, requestId, nodeInfo});
      return data;
    } catch (err) {
      console.log(err);
      throw new NetworkServiceError('Send callback error');
    }
  }
}

module.exports = {
  NetworkService,
  NetworkServiceError,
};
