import {UnitOfWork} from '../infrastructure/storage/database/unit-of-work';
import {FileStorage} from '../infrastructure/storage/file-system';
import {FileModel} from '../models/file.model';
import {FindFileByNameDTO} from './dto/file.dto';
import {SaveFileDTO} from './dto/file.dto';
import {FindFileByHashDTO} from './dto/file.dto';

export declare class FileServiceError extends Error {}

export declare class FileService {
  private readonly db: {unitOfWork: UnitOfWork};
  private readonly fileStorage: FileStorage;
  constructor(container: {db: {unitOfWork: UnitOfWork}; fileStorage: FileStorage});

  public async findFileByHash(findFileByHashDTO: FindFileByHashDTO): Promise<FileModel | null>;

  public async findFileByName(findFileByNameDTO: FindFileByNameDTO): Promise<FileModel>;

  public async getFileByHash(findFileByHashDTO: FindFileByHashDTO): Promise<ReadableStream | null>;

  public async canSaveFile(): Promise<boolean>;

  public async saveFile(saveFileDTO: SaveFileDTO): Promise<FileModel>;

  public async deleteFile(findFileByHashDTO: FindFileByHashDTO): Promise<void>;
}
