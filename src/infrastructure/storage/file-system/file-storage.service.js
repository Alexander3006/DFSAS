'use strict';

const {v4: uuid} = require('uuid');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

class FileStorageError extends Error {}

//TODO: add mutex ??
class FileStorage {
  constructor({config}) {
    this.config = config;
    this.#init();
  }

  #init() {
    const {tempStorage, persistentStorage} = this;
    try {
      const dirs = [tempStorage, persistentStorage];
      dirs.map((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {recursive: true});
        }
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new FileStorageError('Init file storage error');
    }
  }

  static getTempKey() {
    return uuid();
  }

  get tempStorage() {
    const {config} = this;
    return path.join(config.storage, '/temp');
  }

  get persistentStorage() {
    const {config} = this;
    return path.join(config.storage, '/persistent');
  }

  async saveFile({checksum, readFileStream}) {
    const {tempStorage, persistentStorage} = this;
    try {
      const fileTempKey = FileStorage.getTempKey();
      const tempPath = path.join(tempStorage, `/${fileTempKey}`);
      const writeStream = fs.createWriteStream(tempPath);
      await new Promise((res, rej) => {
        writeStream.on('finish', res).on('error', rej);
        readFileStream.pipe(writeStream);
      });
      const fileChecksum = await this.getChecksum({filepath: tempPath});
      if (fileChecksum !== checksum) {
        await fs.promises.rm(tempPath);
        throw new FileStorageError('Checksum not equal');
      }
      const persistentPath = path.join(persistentStorage, `/${fileChecksum}`);
      await fs.promises.rename(tempPath, persistentPath);
      const fileSize = await this.getFileSize({filepath: persistentPath});
      return {
        size: fileSize,
        path: persistentPath,
        checksum: fileChecksum,
      };
    } catch (err) {
      console.log(err);
      throw new FileStorageError('Save file error');
    }
  }

  async getFileSize({filepath}) {
    try {
      const stats = await fs.promises.stat(filepath);
      const sizeBytes = stats.size;
      const sizeMb = sizeBytes / Math.pow(1024, 1); //KB
      return sizeMb;
    } catch (err) {
      console.log(err);
      throw new FileStorageError();
    }
  }

  async getChecksum({filepath}) {
    try {
      const hasher = crypto.createHash('md5');
      hasher.setEncoding('base64url');
      const hash = await new Promise((res, rej) => {
        const fileStream = fs.createReadStream(filepath);
        fileStream
          .on('end', () => {
            hasher.end();
            const hash = hasher.read();
            res(hash);
          })
          .on('error', (err) => rej(err));
        fileStream.pipe(hasher);
      });
      return hash;
    } catch (err) {
      if (err instanceof FileStorageError) throw err;
      console.log(err);
      throw new FileStorageError('Get checksum error');
    }
  }

  async clearDir({dirpath}) {
    try {
      await fs.promises.rm(dirpath, {recursive: true, force: true});
      await fs.promises.mkdir(dirpath, {recursive: true});
      return true;
    } catch (err) {
      console.log(err);
      throw new FileStorageError(`Clear dir ${dirpath} error`);
    }
  }

  async checkFileExistence({filepath}) {
    try {
      const exist = await fs.promises.access(filepath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getFileStream({hash}) {
    const {persistentStorage} = this;
    try {
      const filepath = path.join(persistentStorage, `/${hash}`);
      const exist = await this.checkFileExistence({filepath});
      if (!exist) return null;
      const stream = fs.createReadStream(filepath);
      return stream;
    } catch (err) {
      console.log(err);
      throw new FileStorageError('Get file stream error');
    }
  }

  async deleteFile({hash}) {
    const {persistentStorage} = this;
    try {
      const filepath = path.join(persistentStorage, `/${hash}`);
      const exist = await this.checkFileExistence({filepath});
      if (!exist) return;
      await fs.promises.rm(filepath);
      return;
    } catch (err) {
      console.log(err);
      throw new FileStorageError('Delete file error');
    }
  }
}

module.exports = {
  FileStorage,
  FileStorageError,
};
