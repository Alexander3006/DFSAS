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

class FindFilesByNameDTO {
  constructor(raw) {
    const {address, name} = raw;
    this.name = name;
    this.address = address;
  }

  static fromRaw(raw) {
    FindFilesByNameDTO.validate(raw);
    const dto = new FindFilesByNameDTO(raw);
    return dto;
  }

  static validate(raw) {
    const {name, address} = raw;
    if ((name?.length ?? 0) <= 5) throw new Error();
    return true;
  }

  toMessage() {
    const {name} = this;
    return `${name}`;
  }
}

module.exports = {
  FindFileByHashDTO,
  SaveFileDTO,
  FindFilesByNameDTO,
};
