import {IncomingMessage} from 'http';
import {WebSocket} from 'ws';
import {BaseRouter} from '../interfaces/base.router';

export declare class WebSocketServerError extends BaseServerError {}

export declare class WebSocketServer extends BaseServer {
  constructor(param: {config: object; router: BaseRouter});

  public get clients(): WebSocketClient[];

  public getClient(clientId: string): WebSocketClient;

  private async #onConnection(socket: WebSocket, request: IncomingMessage): Promise<void>;

  private #ping(): NodeJS.Timer;

  private async #onClose(): Promise<void>;

  private async #onError(err: Error): Promise<void>;

  public static validateConfig(config: object): boolean;

  public async start(): Promise<WebSocketServer>;

  public async stop(): Promise<WebSocketServer>;
}
