import {BaseConnection} from '../interfaces/base.connection';
import {BaseEndpoint} from '../interfaces/base.endpoint';
import {Metadata} from '../interfaces/base.router';
import {EndpointMethods} from '../interfaces/constants';

export declare class RouterError extends BaseRouterError {}

export declare class Router extends BaseRouter {
  constructor();

  public async handle(param: {
    connection: BaseConnection;
    payload: object;
    metadata: Metadata;
  }): Promise<void>;

  private #searchEndpoint(method: EndpointMethods, path: string): BaseEndpoint;

  public registerEndpoint(endpoint: BaseEndpoint): Router;
}
