'use strict';

const {FileModel} = require('../models/file.model');
const {FileAccessType, OwnerModel} = require('../models/owner.model');
const {FindFileByHashDTO, SaveFileDTO} = require('./dto/file.dto');

class FileServiceError extends Error {}

class FileService {
  constructor({db, fileStorage}) {
    this.db = db;
    this.fileStorage = fileStorage;
  }

  async findFileByHash(findFileByHashDTO) {
    const {
      db: {unitOfWork},
    } = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, address} = FindFileByHashDTO;
    const {FileRepository} = unitOfWork.repositories;
    try {
      const {owners, ...file} = await FileRepository.findOne({hash}, false);
      const accesses = owners.filter((owner) => {
        const {accessType, address: ownerAddress} = owner;
        const access = accessType !== FileAccessType.HIDDEN || address === ownerAddress;
        if (!access) return owner;
        return false;
      });
      if (!accesses.length) return null;
      return FileModel.fromRaw({...file, owners: accesses});
    } catch (err) {
      console.log(err);
      throw new FileServiceError('Fild file by hash error');
    }
  }

  async getFileByHash(findFileByHashDTO) {
    const {fileStorage} = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, address} = findFileByHashDTO;
    try {
      const {owners, ...file} = await this.findFileByHash({hash, address});
      const accesses = owners.filter((owner) => {
        const {accessType, address: ownerAddress} = owner;
        const access = accessType !== FileAccessType.CLOSED || ownerAddress === address;
        if (!access) return owner;
        return false;
      });
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
    } = this;
    if (!(saveFileDTO instanceof SaveFileDTO)) throw new FileServiceError('Invalid save file dto');
    const canSave = await this.canSaveFile(saveFileDTO);
    if (!canSave) throw new FileServiceError('Can not save file');
    const {readFileStream, checksum, address, metadata, accessType, ttl, name} = saveFileDTO;
    const transaction = await unitOfWork.transaction();
    try {
      const {FileRepository} = transaction.repositories;
      const ownerModel = OwnerModel.fromRaw({
        accessType,
        address,
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
    } = this;
    if (!(findFileByHashDTO instanceof FindFileByHashDTO))
      throw new FileServiceError('Invalid find file dto');
    const {hash, address} = findFileByHashDTO;
    const transaction = await unitOfWork.transaction();
    try {
      const {OwnerRepository, FileRepository} = transaction.repositories;
      const {owners} = await FileRepository.findOne({hash}, false);
      const accesses = owners.filter((owner) => {
        const {address: ownerAddress} = owner;
        const access = address === ownerAddress;
        if (access) return owner;
        return false;
      });
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
