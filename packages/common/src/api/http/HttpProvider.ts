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
 * The method used to accept the request given by the client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'ALL';

/**
 * Type for the callback of when the provider is now accepting connections
 */
export type CallbackType = () => Promise<void> | void;

/**
 * Route type for the URI of an endpoint
 */
export type Route = string;

export type FileOption = {name: string, maxCount?: number};

export type FileOptions = string | string[] | FileOption | FileOptions[] | (string | FileOption)[];

/**
 * The endpoint options that describe the endpoint to the provider accepting the request
 */
export interface EndpointOptions {
    readonly type: HttpMethod;
    readonly uri: Route;
    readonly middleware: HttpExchangeMiddleware[];
    readonly handler: HttpExchangeCallbackHandler;
    readonly files?: FileOptions;
    readonly fileDestination?: string;
}

/**
 * The HTTP Provider will handle the registration of all the system endpoints
 */
export interface HttpProvider {
    /**
     * Register an endpoint for a given route
     *
     * @param options the endpoint options
     */
    registerEndpoint(options: EndpointOptions): void;

    /**
     * Boostrap the provider so it will be ready for accepting connections
     *
     * @param port the port number which will be used to listen to connections
     * @param callback the callback of when the connection has been established
     */
    boostrapProvider(port: number, callback?: CallbackType): void;
}

/**
 * Options for creating an instance of the HttpProvider
 */
export interface HttpProviderFactoryOptions {
    readonly port: number;
    readonly onReady?: CallbackType;
}


/**
 * The HttpProviderFactory will create an instance of the HttpProvider
 */
export interface HttpProviderFactory<T extends HttpProvider> {
    makeProvider(options: HttpProviderFactoryOptions): T
}
