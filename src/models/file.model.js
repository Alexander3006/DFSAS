'use strict';

const {notEmptyValue} = require('../helpers/common');
const {OwnerModel, OwnerRepository} = require('./owner.model');

class FileModelError extends Error {}

class FileModel {
  constructor(raw) {
    const {id, name, hash, size, createdAt, owners} = raw;
    this.id = id; //number(int)
    this.name = name; //string
    this.hash = hash; //string
    this.size = size; //number(int)
    this.owners = owners; //OwnerModel[]
    this.createdAt = createdAt; //string
  }

  static fromRaw(raw) {
    FileModel.validate(raw);
    const model = new FileModel(raw);
    return model;
  }

  static validate(raw) {
    const {name, hash, size, owners} = raw;
    if (!notEmptyValue(name)) throw new FileModelError('Invalid file name');
    if (!notEmptyValue(hash)) throw new FileModelError('Invalid file hash');
    if (!Number.isInteger(size)) throw new FileModelError('Invalid file size');
    if (!!owners && !owners.some((owner) => owner instanceof OwnerModel))
      throw new FileModelError('Invalid file owners');
    return true;
  }
}

const FileRepository = (connection) => {
  const ownerRepository = OwnerRepository(connection);
  return {
    findOne: async ({hash}, lazy) => {
      const getFileQuery = 'SELECT * FROM `files` WHERE `hash` = ?;';
      const getFileParams = [hash];
      const fileRaw = await connection
        .query(getFileQuery, getFileParams)
        .then(([[fileRaw]]) => fileRaw);
      if (!fileRaw) return null;
      const owners = lazy ? null : await ownerRepository.find({fileId: fileRaw.id});
      const fileModel = FileModel.fromRaw({...fileRaw, owners});
      return fileModel;
    },

    create: async function (fileModel) {
      const {owners = [], ...file} = fileModel;
      const {name, hash, size} = file;
      const createFileQuery =
        'INSERT INTO `files` (`name`, `hash`, `size`) VALUE (?, ?, ?)\n' +
        'ON DUPLICATE KEY UPDATE `id` = `id`;';
      const createFileParams = [name, hash, size];
      await connection.query(createFileQuery, createFileParams);
      const newFileModel = await this.findOne({hash}, true);
      await Promise.all(
        owners.map((owner) => ownerRepository.create({...owner, fileId: newFileModel.id})),
      );
      return newFileModel;
    },

    totalFileSize: async () => {
      const getTotalSizeQuery = 'SELECT SUM(`size`) as `totalSize` FROM `files`;';
      const getTotalSizeParams = [];
      const totalSize = await connection
        .query(getTotalSizeQuery, getTotalSizeParams)
        .then(([[result]]) => result?.totalSize ?? 0);
      return totalSize;
    },

    delete: async function ({hash}) {
      const fileModel = await this.findOne({hash}, false);
      if (!fileModel || !!fileModel.owners) throw new FileModelError('Can not delete file');
      const deleteFileQuery = 'DELETE FROM `files` WHERE `hash` = ?;';
      const deleteFileParams = [hash];
      await connection.query(deleteFileQuery, deleteFileParams);
      return fileModel;
    },
  };
};

module.exports = {
  FileModel,
  FileRepository,
};
