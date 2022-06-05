'use strict';

const WS = require('ws');

const WS_EVENTS = {
  FILE_SEARCH_STARTED: 'FILE_SEARCH_STARTED',
  FILE_SEARCH_FINISHED: 'FILE_SEARCH_FINISHED',
  FILE_FOUND: 'FILE_FOUND',
  FIND_FILE_BY_HASH: 'FIND_FILE_BY_HASH',
  FIND_FILES_BY_NAME: 'FIND_FILES_BY_NAME',
  ERROR: 'ERROR',
};

class WsApiClientError extends Error {}

class WsApiClient {
  constructor({signatureService, httpApiClient}) {
    this.signatureService = signatureService;
    this.httpApiClient = httpApiClient;
    this.node = null;
    this.socket = null;
    this.connected = false;
    this.router = new Map();
  }

  subscribe(event, listener) {
    const {router} = this;
    const listeners = router.get(event) ?? new Set();
    listeners.add(listener);
    router.set(event, listeners);
    return this;
  }

  unsubscribe(event, listener) {
    const {router} = this;
    const listeners = router.get(event) ?? new Set();
    const filtered = [...listeners.values()].filter((l) => l !== listener);
    router.set(event, new Set(filtered));
    return this;
  }

  async #route(event, payload, message) {
    const {router} = this;
    const listeners = router.get(event) ?? new Set();
    const handled = [...listeners.values()].map((listener) => listener(payload, message, this));
    await Promise.allSettled(handled);
    return;
  }

  connect(node) {
    try {
      const socket = new WS(node);
      let pingTimeout;
      const heartbeat = () => {
        socket.pong();
        clearTimeout(pingTimeout);
        pingTimeout = setTimeout(async () => {
          await socket.destroy();
        }, 31000);
      };
      socket.on('open', heartbeat);
      socket.on('ping', heartbeat);
      //
      socket.on('close', async (_) => {
        clearTimeout(pingTimeout);
        this.disconnect();
      });
      //
      socket.on('message', async (message) => {
        const data = JSON.parse(message);
        const {event, payload, message: mes} = data;
        await this.#route(event, payload, mes);
      });
      //
      this.socket = socket;
      this.node = node;
      this.connected = true;
      //
    } catch (err) {
      console.log(err);
      throw new WsApiClientError('Connect ws error');
    }
  }

  disconnect() {
    try {
      this.node = null;
      this.socket = null;
      this.connected = false;
      return this;
    } catch (err) {
      console.log(err);
      throw new WsApiClientError('Disconnect ws error');
    }
  }

  async send(event, payload) {
    const {connected, socket} = this;
    if (!connected) throw new WsApiClientError('Ws socket not connected');
    try {
      const request = JSON.stringify({event, payload});
      return socket.send(request);
    } catch (err) {
      console.log(err);
      throw new WsApiClientError('Send request error');
    }
  }

  async searchFileByHashRequest({hash, secret, timeout}) {
    const {signatureService, httpApiClient} = this;
    try {
      const publicKey = await signatureService.getPublicKey(secret);
      const address = signatureService.publicKeyToAddress(publicKey);
      const nonce = await httpApiClient.getNonce({publicKey});
      const message = `${hash}:${nonce}`;
      const signature = await signatureService.signMessage(message, secret);
      const payload = JSON.stringify({
        signature: {signature, publicKey, nonce},
        data: {hash, address},
        timeout: timeout,
      });
      await this.send(WS_EVENTS.FIND_FILE_BY_HASH, payload);
      return;
    } catch (err) {
      console.log(err);
      throw new WsApiClientError('Search file by hash request error');
    }
  }

  async searchFilesByNameRequest({name, secret, timeout}) {
    const {signatureService, httpApiClient} = this;
    try {
      const publicKey = await signatureService.getPublicKey(secret);
      const address = signatureService.publicKeyToAddress(publicKey);
      const nonce = await httpApiClient.getNonce({publicKey});
      const message = `${name}:${nonce}`;
      const signature = await signatureService.signMessage(message, secret);
      const payload = JSON.stringify({
        signature: {signature, publicKey, nonce},
        data: {name, address},
        timeout: timeout,
      });
      await this.send(WS_EVENTS.FIND_FILES_BY_NAME, payload);
      return;
    } catch (err) {
      console.log(err);
      throw new WsApiClientError('Search file by hash request error');
    }
  }
}

module.exports = {
  WsApiClient,
  WsApiClientError,
  WS_EVENTS,
};
