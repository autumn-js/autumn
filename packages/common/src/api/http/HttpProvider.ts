import {Request} from "./Request";
import {Response} from "./Response";

/**
 * The Exchange Callback handler is called when the client has made a request to the endpoint
 */
export type HttpExchangeCallbackHandler = (req: Request, resp: Response) => Promise<void>;

/**
 * The Exchange middleware is run before the CallbackHandler and will choose whether this client is okay to run the
 * endpoint handler
 */
export type HttpExchangeMiddleware = (req: Request, resp: Response, next: CallableFunction) => Promise<void>;

/**
 * 
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'ALL';

export interface HttpProvider {
    registerEndpoint(method: HttpMethod, middleware: HttpExchangeMiddleware[], handler: HttpExchangeCallbackHandler): Promise<void>;
    registerEndpoint(method: HttpMethod, handler: HttpExchangeCallbackHandler): Promise<void>;
}