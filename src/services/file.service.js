'use strict';

const {hasher} = require('../helpers/encryptor');
const {FileModel} = require('../models/file.model');
const {FileAccessType, OwnerModel} = require('../models/owner.model');
const {FindFileByHashDTO, SaveFileDTO} = require('./dto/file.dto');

class FileServiceError extends Error {}

class FileService {
  constructor({db, fileStorage}) {
    this.db = db;
    this.fileStorage = fileStorage;
    this.hasher = hasher();
  }

  async findFileByHash(findFileByHashDTO) {
    const {
      db: {unitOfWork},
      hasher,
    } = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, password} = FindFileByHashDTO;
    const {FileRepository} = unitOfWork.repositories;
    try {
      const {owners, ...file} = await FileRepository.findOne({hash}, false);
      const accesses = await Promise.all(
        owners.map(async (owner) => {
          const {accessType, password: hash} = owner;
          const access =
            accessType !== FileAccessType.HIDDEN || (await hasher.compare(password, hash));
          if (!access) return owner;
          return false;
        }),
      ).then((accesses) => accesses.filter((access) => !!access));
      if (!accesses.length) return null;
      return FileModel.fromRaw({...file, owners: accesses});
    } catch (err) {
      console.log(err);
      throw new FileServiceError('Fild file by hash error');
    }
  }

  async getFileByHash(findFileByHashDTO) {
    const {fileStorage, hasher} = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, password} = findFileByHashDTO;
    try {
      const {owners, ...file} = await this.findFileByHash({hash, password});
      const accesses = await Promise.all(
        owners.map(async (owner) => {
          const {accessType, password: hash} = owner;
          const access =
            accessType !== FileAccessType.CLOSED || (await hasher.compare(password, hash));
          if (!access) return owner;
          return false;
        }),
      ).then((accesses) => accesses.filter((access) => !!access));
      if (!accesses.length) return null;
      const fileStream = await fileStorage.getFileStream({hash});
      return fileStream;
    } catch (err) {
      console.log(err);
      throw new FileServiceError('Get file by hash error');
    }
  }

  async canSaveFile() {
    try {
      //TODO
      return true;
    } catch (err) {
      console.log(err);
      throw new FileServiceError('Can save file error');
    }
  }

  async saveFile(saveFileDTO) {
    const {
      db: {unitOfWork},
      fileStorage,
      hasher,
    } = this;
    if (!(saveFileDTO instanceof SaveFileDTO)) throw new FileServiceError('Invalid save file dto');
    const canSave = await this.canSaveFile(saveFileDTO);
    if (!canSave) throw new FileServiceError('Can not save file');
    const {readFileStream, checksum, password, metadata, accessType, ttl, name} = saveFileDTO;
    const transaction = await unitOfWork.transaction();
    try {
      const {FileRepository} = transaction.repositories;
      const ownerModel = OwnerModel.fromRaw({
        accessType,
        password: await hasher.hash(password),
        metadata,
        ttl,
      });
      const fileModel = FileModel.fromRaw({
        name,
        hash: checksum,
        size: 0,
        owners: [ownerModel],
      });
      const {size} = await fileStorage.saveFile({checksum, readFileStream});
      const newFileModel = await FileRepository.create({...fileModel, size});
      await transaction.commit();
      return newFileModel;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      throw new FileServiceError('Save file error');
    } finally {
      transaction.release();
    }
  }

  async deleteFile(findFileByHashDTO) {
    const {
      fileStorage,
      db: {unitOfWork},
      hasher,
    } = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, password} = findFileByHashDTO;
    const transaction = await unitOfWork.transaction();
    try {
      const {OwnerRepository, FileRepository} = transaction.repositories;
      const {owners} = await FileRepository.findOne({hash}, false);
      const accesses = await Promise.all(
        owners.map(async (owner) => {
          const {password: hash} = owner;
          const access = await hasher.compare(password, hash);
          if (access) return owner;
          return false;
        }),
      ).then((accesses) => accesses.filter((access) => !!access));
      await Promise.all(accesses.map((access) => OwnerRepository.delete(access)));
      if (owners.length <= accesses.length) {
        await transaction.commit();
        return;
      }
      await FileRepository.delete({hash});
      await fileStorage.deleteFile({hash});
      await transaction.commit();
      return;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      throw new FileServiceError('Delete file error');
    } finally {
      transaction.release();
    }
  }
}

module.exports = {
  FileService,
  FileServiceError,
};
