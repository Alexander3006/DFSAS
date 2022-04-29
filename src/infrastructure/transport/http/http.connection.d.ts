import formidable from 'formidable';
import {IncomingMessage, ServerResponse} from 'http';
import {BaseConnection, BaseConnectionError} from '../interfaces/base.connection';

export declare class HttpConnectionError extends BaseConnectionError {}

export declare class HttpConnection extends BaseConnection {
  constructor(param: {req: IncomingMessage; res: ServerResponse});

  public route(): {path: string; method: string};

  public async payload(): Promise<string>;

  public async multiform(): Promise<{
    files: formidable.Files;
    data: object;
    clear: () => Promise<void>;
  }>;

  public async send(data: ReadableStream | string): Promise<void>;

  public async destroy(): Promise<void>;
}
