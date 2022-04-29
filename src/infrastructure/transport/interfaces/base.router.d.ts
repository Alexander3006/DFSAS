import {BaseConnection} from './base.connection';
import {BaseEndpoint} from './base.endpoint';
import {TransportType} from './constants';

export declare class BaseRouterError extends Error {}

export type Metadata = {
  transport: TransportType;
};

export declare interface BaseRouter {
  constructor();

  handle(param: {connection: BaseConnection; payload: object; metadata: Metadata}): Promise<any>;

  registerEndpoint(endpoint: BaseEndpoint): Promise<BaseRouter>;
}
