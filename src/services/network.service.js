'use strict';

const {default: axios} = require('axios');
const {RequestDTO} = require('./dto/network.dto');

class NetworkServiceError extends Error {}

class NetworkService {
  constructor({config, networkWebsocketClientManager, memoryCache}) {
    this.config = config;
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
      for (const peer of peers.values()) {
        await peer.send(broadcastData);
      }
      return;
    } catch (err) {
      console.log(err);
      throw new NetworkServiceError('Broadcast to peers error');
    }
  }

  async callback(url, payload) {
    try {
      const {data} = await axios.post(url, payload);
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
