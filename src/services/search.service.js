'use strict';

const {SearchFilesByNameDTO} = require('./dto/search.dto');
const {SearchFileByHashDTO} = require('./dto/search.dto');

class SearchServiceError extends Error {}

class SearchService {
  constructor({fileService, networkService}) {
    this.fileService = fileService;
    this.networkService = networkService;
  }

  async searchFileByHash(searchFileByHashDTO) {
    const {fileService, networkService} = this;
    if (!(searchFileByHashDTO instanceof SearchFileByHashDTO))
      throw new SearchServiceError('Invalid searh file dto');
    const {request, payload} = searchFileByHashDTO;
    try {
      const fileModel = await fileService.findFileByHash(payload);
      if (fileModel)
        await networkService.callback(request, fileModel).catch((err) => console.log(err));
      await networkService.broadcastRequestToPeers('FIND_FILE_BY_HASH', request, payload);
      return fileModel;
    } catch (err) {
      console.log(err);
      throw new SearchServiceError('Search file error');
    }
  }

  async searchFilesByName(searchFilesByNameDTO) {
    const {fileService, networkService} = this;
    if (!(searchFilesByNameDTO instanceof SearchFilesByNameDTO))
      throw new SearchServiceError('Invalid searh file dto');
    const {request, payload} = searchFilesByNameDTO;
    try {
      const fileModels = await fileService.findFilesByName(payload);
      await Promise.allSettled(
        fileModels.map((fileModel) =>
          networkService.callback(request, fileModel).catch((err) => console.log(err)),
        ),
      );
      await networkService.broadcastRequestToPeers('FIND_FILE_BY_NAME', request, payload);
      return fileModels;
    } catch (err) {
      console.log(err);
      throw new SearchServiceError('Search file error');
    }
  }
}

module.exports = {
  SearchService,
  SearchServiceError,
};
