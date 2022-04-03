'use strict';

class SignatureDTO {
  constructor(raw) {
    const {publicKey, nonce, signature} = raw;
    this.nonce = nonce;
    this.publicKey = publicKey;
    this.signature = signature;
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
