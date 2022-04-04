'use strict';

class VerificationServiceError extends Error {}

class VerificationService {
  constructor({memoryCache, signatureService}) {
    this.memoryCache = memoryCache;
    this.signatureService = signatureService;
  }

  static getKeyNonce(address) {
    return `temp_nonce:${address}`;
  }

  static getSignatureMessage(message, nonce) {
    return `${message}:${nonce}`;
  }

  async generateNonce({address}) {
    const {memoryCache, signatureService} = this;
    try {
      const nonce = signatureService.generateNonce();
      const key = VerificationService.getKeyNonce(address);
      await memoryCache.set(key, nonce, 60); //1 min expiry
      return nonce;
    } catch (err) {
      console.log(err);
      throw new VerificationServiceError('Generate nonce error');
    }
  }

  async verify(signatureDTO) {
    const {memoryCache, signatureService} = this;
    try {
      const {message, nonce, signature, publicKey} = signatureDTO;
      const address = signatureService.publicKeyToAddress(publicKey);
      const key = VerificationService.getKeyNonce(address);
      const cacheNonce = await memoryCache.get(key);
      if (cacheNonce !== nonce) throw new VerificationServiceError('Invalid nonce');
      const signatureMessage = VerificationService.getSignatureMessage(message, nonce);
      const verified = signatureService.verify(signatureMessage, signature, publicKey);
      return verified ? address : null;
    } catch (err) {
      if (err instanceof VerificationServiceError) throw err;
      console.log(err);
      throw new VerificationServiceError('Verify message error');
    }
  }

  async generateSignature({message, nonce, privateKey}) {
    const {signatureService} = this;
    try {
      const signatureMessage = VerificationService.getSignatureMessage(message, nonce);
      const signature = signatureService.signMessage(signatureMessage, privateKey);
      return signature;
    } catch (err) {
      console.log(err);
      throw new VerificationServiceError('Generate signature error');
    }
  }
}

module.exports = {
  VerificationService,
  VerificationServiceError,
};
