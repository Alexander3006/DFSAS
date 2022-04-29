import {TransportType} from './constants';

export declare class BaseServerError extends Error {}

export declare interface BaseServer {
  constructor(param: {type: TransportType});

  public static validateConfig(config: object): Promise<boolean>;

  public start(): Promise<BaseServer>;

  public stop(): Promise<BaseServer>;

  get clients(): any[];
}
