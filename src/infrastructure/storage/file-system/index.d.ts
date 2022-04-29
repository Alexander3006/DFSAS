export declare class FileStorageError extends Error {}

export declare class FileStorage {
  private readonly config: object;
  constructor(params: {config: object});

  private #init(): boolean;

  public static getTempKey(): string;

  public get tempStorage(): string;

  public get persistentStorage(): string;

  public async saveFile(params: {checksum: string; readFileStream: ReadableStream}): Promise<{
    size: number;
    path: string;
    checksum: string;
  }>;

  public async getFileSize(param: {filepath: string}): Promise<number>;

  public async getChecksum(param: {filepath: string}): Promise<string>;

  public async clearDir(param: {dirpath: string}): Promise<boolean>;

  public async checkFileExistence(param: {filepath: string}): Promise<boolean>;

  public async getFileStream(params: {hash: string}): Promise<ReadableStream>;

  public async deleteFile(params: {hash: string}): Promise<undefined>;
}
