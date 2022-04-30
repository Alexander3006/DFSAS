import EventEmitter from 'events';

export declare class PubSubError extends Error {}

export declare class PubSub {
  private readonly ee: EventEmitter;
  constructor();

  public async sub(key: string | Symbol, listener: (...args: any[]) => void): Promise<boolean>;
  public async pub(key: string | Symbol, value: any): Promise<void>;
  public async unsub(key: string | Symbol, listener: (...args: any[]) => void): Promise<boolean>;
}
