'use strict';

class RequestDTO {
  constructor(raw) {
    const {requestId, expirationTime, callbackUrl} = raw;
    this.requestId = requestId;
    this.expirationTime = expirationTime;
    this.callbackUrl = callbackUrl;
  }

  static fromRaw(raw) {
    RequestDTO.validate(raw);
    const dto = new RequestDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }
}

module.exports = {
  RequestDTO,
};
