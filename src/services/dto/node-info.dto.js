'use strict';

class NodeInfoDTO {
  constructor(raw) {
    const {ip, ws, http, version, address} = raw;
    this.ip = ip;
    this.ws = ws;
    this.http = http;
    this.version = version;
    this.address = address;
  }

  static fromRaw(raw) {
    NodeInfoDTO.validate(raw);
    const dto = new NodeInfoDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }

  toMessage() {
    return ``;
  }
}

module.exports = {
  NodeInfoDTO,
};
