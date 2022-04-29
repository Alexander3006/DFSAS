import {BaseRouter} from '../interfaces/base.router';
import {WebSocketConnection} from './websocket.connection';

export declare class WebSocketClientError extends Error {}

export declare class WebSocketClient {
  constructor(param: {router: BaseRouter | null | undefined});

  public async connect(param: {url: string}): Promise<WebSocketConnection>;

  public get clients(): WebSocketClient[];

  public getClient(serverId: string): WebSocketClient;

  public async stop(): Promise<void>;
}
