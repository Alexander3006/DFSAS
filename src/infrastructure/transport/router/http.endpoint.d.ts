import {HttpConnection} from '../http/http.connection';
import {Metadata} from '../interfaces/base.router';
import {EndpointMethods} from '../interfaces/constants';

export declare class HttpEndpointError extends BaseEndpointError {}

type HttpHandler = (param: {
  connection: HttpConnection;
  context: {payload: object; metadata: Metadata};
}) => Promise<any>;

export declare class HttpEndpoint extends BaseEndpoint {
  constructor(param: {method: EndpointMethods; path: string; handler: HttpHandler});
}
