'use strict';

const crypto = require('crypto');

class SignatureService {
  constructor() {}

  generateKeyPair() {
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    return {privateKey, publicKey};
  }

  publicKeyToAddress(publicKey) {
    const address = crypto.createHash('md5').update(publicKey).digest('hex');
    return address;
  }

  signMessage(message, privateKey) {
    const signature = crypto.sign('sha256', Buffer.from(message), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
    return signature.toString('hex');
  }

  verify(message, signature, publicKey) {
    const isVerified = crypto.verify(
      'sha256',
      Buffer.from(message),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, 'hex'),
    );
    return isVerified;
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
// const signatureService = new SignatureService();
// const {privateKey, publicKey, address} = signatureService.generateKeyPair();
// console.dir({privateKey, publicKey, address});
// const message = 'SECRET MESSAGE';
// const signature = signatureService.signMessage(message, privateKey);
// console.dir(signature);
// const verified = signatureService.verify(message, signature, publicKey);
// console.dir(verified);
