import {WebSocketClient} from '../infrastructure/transport/websocket/websocket.client';
import {MemoryCache} from '../system/memory-cache';
import {RequestDTO} from './dto/network.dto';
import {NodeInfoDTO} from './dto/node-info.dto';
import {SearchFileResponseDTO} from './dto/search.dto';

export declare class NetworkServiceError extends Error {}

export declare class NetworkService {
  private readonly config: object; //TODO
  private readonly node: object; //TODO
  private readonly memoryCache: MemoryCache;
  private readonly networkWebsocketClientManager: WebSocketClient;
  constructor(contrainer: {
    config: object; //TODO
    node: object; //TODO
    memoryCache: MemoryCache;
    networkWebsocketClientManager: WebSocketClient;
  });

  public async start(): Promise<NetworkService>;

  public static broadcastKey(requestId: string): string;

  //TODO: path enum(supported ws events)
  async broadcastRequestToPeers(path: string, requestDTO: RequestDTO, payload: any): Promise<void>;

  async callback<Payload>(requestDTO: RequestDTO, payload: Payload): Promise<any>;
}
