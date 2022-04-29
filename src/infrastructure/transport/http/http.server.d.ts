import {IncomingMessage, ServerResponse} from 'http';
import {BaseRouter} from '../interfaces/base.router';
import {BaseServer, BaseServerError} from '../interfaces/base.server';
import {HttpConnection} from './http.connection';

export declare class HttpServerError extends BaseServerError {}

class HttpServer extends BaseServer {
  constructor(param: {config: object; router: BaseRouter});

  public get clients(): HttpConnection[];

  public static validateConfig(config: object): boolean;

  private async #listener(req: IncomingMessage, res: ServerResponse): Promise<void>;

  public start(): HttpServer;

  public stop(): HttpServer;
}
