'use strict';

const {FindFileByHashDTO} = require('./file.dto');
const {RequestDTO} = require('./network.dto');

class SearchFileByHashDTO {
  constructor(raw) {
    const {request, payload} = raw;
    this.request = request;
    this.payload = payload;
  }

  static fromRaw(raw) {
    SearchFileByHashDTO.validate(raw);
    const dto = new SearchFileByHashDTO(raw);
    return dto;
  }

  static validate(raw) {
    const {request, payload} = raw;
    if (!(request instanceof RequestDTO)) throw new Error();
    if (!(payload instanceof FindFileByHashDTO)) throw new Error();
    return true;
  }
}

class SearchFileResponseDTO {
  constructor(raw) {
    const {requestId, payload, nodeInfo} = raw;
    this.requestId = requestId;
    this.payload = payload;
    this.nodeInfo = nodeInfo;
  }

  static fromRaw(raw) {
    SearchFileResponseDTO.validate(raw);
    const dto = new SearchFileResponseDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }
}

module.exports = {
  SearchFileByHashDTO,
  SearchFileResponseDTO,
};
