'use strict';

class SignatureDTO {
  constructor(raw) {
    const {publicKey, nonce, signature, message} = raw;
    this.nonce = nonce;
    this.publicKey = publicKey;
    this.signature = signature;
    this.message = message;
  }

  static fromRaw(raw) {
    SignatureDTO.validate(raw);
    const dto = new SignatureDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }
}

module.exports = {
  SignatureDTO,
};
