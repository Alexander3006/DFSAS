import {PubSub} from './pub-sub';

export declare class MemoryChacheError extends Error {}

export declare class MemoryChache {
  private readonly pubsub: PubSub | null;
  private storage: Map<string, any>;
  constructor(container: {pubsub: null | PubSub});

  public static expiresEvent(key: string): string;

  public set(key: string, value: any, expiry?: int): boolean;

  public get(key: string): any;
}
