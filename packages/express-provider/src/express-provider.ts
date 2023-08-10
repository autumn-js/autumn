import express, {Express} from "express";

export type EndpointType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'ALL';
export type MiddlewareType  = (req: Object, res: Object, next: CallableFunction) => Promise<void> | void;
export type HandlerType  = (req: Object, res: Object) => Promise<void> | void;
export type CallbackType = () => Promise<void> | void;

export interface ProviderFactoryOptions {
    readonly port: number;
    readonly onReady?: CallbackType;
}

export interface EndpointOptions {
    readonly type: EndpointType;
    readonly uri: string;
    readonly middleware: MiddlewareType[];
    readonly handler: HandlerType;
}

export class ExpressProvider {
    private readonly types: EndpointType[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'ALL']
    constructor(private readonly expressApp: Express) {
    }

    public boostrapClient(port: number, cb?: CallbackType) {
        this.expressApp.listen(port, cb);
    }

    public registerEndpoint(options: EndpointOptions) {
        if (this.types.findIndex(t => t === options.type) === -1) {
            throw new Error(`Method Type ${options.type} not supported`);
        } else {
            this.expressApp[options.type.toLowerCase()](options.uri, options.middleware, options.handler);
        }
    }
}

export class ExpressProviderFactory {
    public static makeProvider(options: ProviderFactoryOptions) {
        const app = express();
        const provider = new ExpressProvider(app);
        provider.boostrapClient(options.port, options.onReady);

        return provider;
    }
}