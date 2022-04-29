export declare class HashService {
  constructor();
  public async hash(data: string, rounds?: int): Promise<string>;
  public async compare(data: string, hash: string): Promise<string>;
}
