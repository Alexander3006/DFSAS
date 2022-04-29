import {BaseConnection} from './base.connection';
import {EndpointMethods} from './constants';

export declare class BaseEndpointError extends Error {}

type BaseHandler = (param: {connection: BaseConnection; context: object}) => Promise<any>;

export declare interface BaseEndpoint {
  constructor(param: {method: EndpointMethods; path: string; handler});

  execute(param: {connection: BaseConnection; context: object});
}
