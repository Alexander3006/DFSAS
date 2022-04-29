import {BaseEndpointError} from '../interfaces/base.endpoint';
import {EndpointMethods} from '../interfaces/constants';

export declare class WebSocketEndpointError extends BaseEndpointError {}

type WebSocketHandler = (param: {
  connection: HttpConnection;
  context: {payload: object; metadata: Metadata};
}) => Promise<any>;

export declare class WebSocketEndpoint extends BaseEndpoint {
  constructor(param: {path: string; handler: WebSocketHandler});
}
