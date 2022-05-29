import {FileModel} from '../models/file.model';
import {SearchFileByHashDTO} from './dto/search.dto';
import {FileService} from './file.service';
import {NetworkService} from './network.service';

export declare class SearchServiceError extends Error {}

export declare class SearchService {
  private readonly fileService: FileService;
  private readonly networkService: NetworkService;
  constructor(container: {fileService: FileService; networkService: NetworkService});

  public async searchFileByHash(
    searchFileByHashDTO: SearchFileByHashDTO,
  ): Promise<FileModel | void>;

  public async searchFilesByName();
}
