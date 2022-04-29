export declare class BaseConnectionError extends Error {}

export declare interface BaseConnection {
  constructor();

  payload();

  send(data);

  destroy();

  route();
}
