import {IncomingMessage} from 'http';
import {WebSocket} from 'ws';
import {BaseConnection} from '../interfaces/base.connection';
import {BaseConnectionError} from '../interfaces/base.connection';

export declare class WebSocketConnectionError extends BaseConnectionError {}

export declare class WebSocketConnection extends BaseConnection {
  constructor(param: {socket: WebSocket; request: IncomingMessage});

  public route(): void;

  public async payload(): Promise<void>;

  public async send(data: string): Promise<void>;

  public async destroy(): Promise<void>;

  public async ping(): Promise<void>;

  public async pong(): Promise<void>;
}
