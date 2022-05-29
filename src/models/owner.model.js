'use strict';

const {notEmptyValue} = require('../helpers/common');

const FileAccessType = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  HIDDEN: 'HIDDEN',
};

class OwnerModelError extends Error {}

class OwnerModel {
  constructor(raw) {
    const {id, ttl, accessType, address, metadata, fileId, createdAt} = raw;
    this.id = id;
    this.accessType = accessType; //FileAccessType(string)
    this.address = address; //string
    this.metadata = metadata; //json -> object
    this.ttl = ttl; //number(int) days
    this.fileId = fileId; //number(int)
    this.createdAt = createdAt;
  }

  static fromRaw(raw) {
    OwnerModel.validate(raw);
    const model = new OwnerModel(raw);
    return model;
  }

  static validate(raw) {
    const {ttl, accessType, address, metadata} = raw;
    if (!Number.isInteger(ttl) || ttl <= 0) throw new OwnerModelError('Invalid file ttl');
    if (!Object.values(FileAccessType).includes(accessType))
      throw new OwnerModelError('Invalid file access type');
    if (!notEmptyValue(address)) throw new OwnerModelError('Invalid file address');
    if (!!metadata && typeof metadata !== 'object')
      throw new OwnerModelError('Invalid file metadata');
  }
}

const OwnerRepository = (connection) => ({
  create: async (ownerModel) => {
    const {ttl, accessType, address, metadata = {}, fileId} = ownerModel;
    const createOwnerQuery =
      'INSERT INTO `owners` (`ttl`, `accessType`, `address`, `metadata`, `fileId`) VALUE (?, ?, ?, ?, ?)\n' +
      'ON DUPLICATE KEY UPDATE `id` = `id`;';
    const createOwnerParams = [ttl, accessType, address, JSON.stringify(metadata), fileId];
    await connection.query(createOwnerQuery, createOwnerParams);
  },

  find: async ({fileId}) => {
    const getOwnersQuery = 'SELECT * FROM `owners` WHERE `fileId` = ?;';
    const getOwnersParams = [fileId];
    const ownerRaws = await connection
      .query(getOwnersQuery, getOwnersParams)
      .then(([ownerRaws]) => ownerRaws);
    const owners = ownerRaws.map((ownerRaw) => OwnerModel.fromRaw(ownerRaw));
    return owners;
  },

  delete: async ({id}) => {
    const deleteOwnerQuery = 'DELETE FROM `owners` WHERE `id` = ?;';
    const deleteOwnerParams = [id];
    await connection.query(deleteOwnerQuery, deleteOwnerParams);
  },
});

module.exports = {
  OwnerModel,
  OwnerModelError,
  OwnerRepository,
  FileAccessType,
};
