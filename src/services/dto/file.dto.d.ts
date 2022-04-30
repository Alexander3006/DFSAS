import {FileAccessType} from '../../models/owner';

type FindFileByHashRaw = {
  hash: string;
  address: string;
};

export declare class FindFileByHashDTO {
  public readonly hash: string;
  public readonly address: string;

  constructor(raw: FindFileByHashRaw);

  public static fromRaw(raw: FindFileByHashRaw): FindFileByHashDTO;

  public static validate(raw: FindFileByHashRaw): boolean;

  public toMessage(): string;
}

type SaveFileRaw = {
  ttl: number;
  name: string;
  checksum: string;
  address: string;
  metadata: object;
  accessType: FileAccessType;
  readFileStream: ReadableStream;
};

export declare class SaveFileDTO {
  public readonly ttl: number;
  public readonly name: string;
  public readonly checksum: string;
  public readonly address: string;
  public readonly metadata: object;
  public readonly accessType: FileAccessType;
  public readonly readFileStream: ReadableStream;
  constructor(raw: SaveFileRaw);

  public static fromRaw(raw: SaveFileRaw): SaveFileDTO;

  public static validate(raw: SaveFileRaw): boolean;

  public toMessage(): string;
}
