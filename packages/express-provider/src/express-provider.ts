import express, {Express, Request as ExpressRequest, RequestHandler, Response as ExpressResponse} from "express";
import {
    CallbackType,
    EndpointOptions, HttpExchangeCallbackHandler,
    HttpMethod,
    HttpProvider,
    HttpProviderFactoryOptions, QueryParams,
    Request, Response
} from "@autumn-js/common";
import {json} from "body-parser";

export class ExpressProvider implements HttpProvider {
    private readonly types: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'ALL']
    constructor(private readonly expressApp: Express) {
        expressApp.use(json())
    }

    public boostrapProvider(port: number, cb?: CallbackType) {
        this.expressApp.listen(port, cb);
    }

    public registerEndpoint(options: EndpointOptions) {
        if (this.types.findIndex(t => t === options.type) === -1) {
            throw new Error(`Method Type ${options.type} not supported`);
        } else {
            this.expressApp[options.type.toLowerCase()](options.uri, options.middleware, this.makeHandler(options.handler));
        }
    }

    public makeHandler(endpointHandler: HttpExchangeCallbackHandler): RequestHandler  {
        return (req: ExpressRequest, res: ExpressResponse) => {
            endpointHandler(this.makeRequestFromRequest(req), this.makeResponseFromResponse(res))
                .catch(err => {
                    console.error(err);
                });
        }
    }

    public makeResponseFromResponse(res: ExpressResponse): Response {
        return res;
    }

    public makeRequestFromRequest(req: ExpressRequest): Request {
        const respReq: Request = req as any;
        respReq.queryParams = req.query as QueryParams;
        respReq.method = req.method.toUpperCase() as HttpMethod;

        return respReq;
    }
}

export class ExpressProviderFactory {
    public static makeProvider(options: HttpProviderFactoryOptions) {
        const app = express();
        const provider = new ExpressProvider(app);
        provider.boostrapProvider(options.port, options.onReady);

        return provider;
    }
}

export default {
    factory: ExpressProviderFactory
}