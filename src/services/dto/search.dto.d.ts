import {FileModel} from '../../models/file.model';
import {FindFileByHashDTO} from './file.dto';
import {RequestDTO} from './network.dto';

type SearchFileByHashRaw = {
  request: RequestDTO;
  payload: FindFileByHashDTO;
};

export declare class SearchFileByHashDTO {
  public readonly request: RequestDTO;
  public readonly payload: FindFileByHashDTO;
  constructor(raw: SearchFileByHashRaw);

  public static fromRaw(raw: SearchFileByHashRaw): SearchFileByHashDTO;

  public static validate(raw: SearchFileByHashRaw): boolean;
}

type SearchFileResponseRaw = {
  requestId: string;
  payload: FileModel;
};

export declare class SearchFileResponseDTO {
  public readonly requestId: string;
  public readonly payload: FileModel;
  constructor(raw: SearchFileResponseRaw);

  public static fromRaw(raw: SearchFileResponseRaw): SearchFileResponseDTO;
  public static validate(raw: SearchFileResponseRaw): boolean;
}
