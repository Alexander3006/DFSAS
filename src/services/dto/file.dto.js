'use strict';

class FindFileByHashDTO {
  constructor(raw) {
    const {hash, address} = raw;
    this.hash = hash;
    this.address = address;
  }
  static fromRaw(raw) {
    FindFileByHashDTO.validate(raw);
    const dto = new FindFileByHashDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }

  toMessage() {
    const {hash} = this;
    return `${hash}`;
  }
}

class SaveFileDTO {
  constructor(raw) {
    const {readFileStream, checksum, address, metadata, accessType, ttl, name} = raw;
    this.ttl = ttl;
    this.name = name;
    this.checksum = checksum;
    this.address = address;
    this.metadata = metadata ?? {};
    this.accessType = accessType;
    this.readFileStream = readFileStream;
  }

  static fromRaw(raw) {
    SaveFileDTO.validate(raw);
    const dto = new SaveFileDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }

  toMessage() {
    const {checksum, name} = this;
    return `${name}:${checksum}`;
  }
}

module.exports = {
  FindFileByHashDTO,
  SaveFileDTO,
};
