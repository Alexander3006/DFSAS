'use strict';

class FindFileByHashDTO {
  constructor(raw) {
    const {hash, password} = raw;
    this.hash = hash;
    this.password = password;
  }
  static fromRaw(raw) {
    FindFileByHashDTO.validate(raw);
    const dto = new SearchFileByHashDTO(raw);
    return dto;
  }

  static validate(raw) {
    //TODO
    return true;
  }
}

class SaveFileDTO {
  constructor(raw) {
    const {readFileStream, checksum, password, metadata, accessType, ttl, name} = raw;
    this.ttl = ttl;
    this.name = name;
    this.checksum = checksum;
    this.password = password;
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
}

module.exports = {
  FindFileByHashDTO,
  SaveFileDTO,
};
