'use strict';

const crypto = require('crypto');
const ed25519 = require('@noble/ed25519');
const {uint8toHex, hexToUint8} = require('./helpers.js');

class SignatureService {
  constructor() {}

  async generateKeyPair() {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = await ed25519.getPublicKey(privateKey);
    return {
      privateKey: uint8toHex(privateKey),
      publicKey: uint8toHex(publicKey),
    };
  }

  publicKeyToAddress(publicKey) {
    const address = crypto.createHash('md5').update(publicKey).digest('hex');
    return address;
  }

  async getPublicKey(privateKey) {
    const publicKey = await ed25519.getPublicKey(privateKey);
    return uint8toHex(publicKey);
  }

  async signMessage(message, privateKey) {
    const hexMessage = Buffer.from(message).toString('hex');
    const signature = await ed25519.sign(hexMessage, privateKey);
    return uint8toHex(signature);
  }

  async verify(message, signature, publicKey) {
    const hexMessage = Buffer.from(message).toString('hex');
    const verified = await ed25519.verify(signature, hexMessage, publicKey);
    return verified;
  }

  generateNonce() {
    const nonce = crypto.randomBytes(16).toString('hex');
    return nonce;
  }
}

module.exports = {
  SignatureService,
};

//TEST
// (async() => {
//   const signatureService = new SignatureService();
//   const {privateKey, publicKey} = await signatureService.generateKeyPair();
//   const address = signatureService.publicKeyToAddress(publicKey);
//   console.dir({privateKey, publicKey, address});
//   const message = 'SECRET MESSAGE';
//   const signature = await signatureService.signMessage(message, privateKey);
//   console.dir(signature);
//   const verified = await signatureService.verify(message, signature, publicKey);
//   console.dir(verified);
// })();
