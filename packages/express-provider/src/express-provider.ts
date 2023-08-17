import express, {Express, Request as ExpressRequest, RequestHandler, Response as ExpressResponse} from "express";
import {
    CallbackType,
    EndpointOptions, FileOption, FileOptions, HttpExchangeCallbackHandler,
    HttpMethod,
    HttpProvider, HttpProviderFactory,
    HttpProviderFactoryOptions, QueryParams,
    Request, Response
} from "@autumn-js/common";
import * as bp from "body-parser";
import bpXml from "body-parser-xml";
import multer from "multer";

export class ExpressProvider implements HttpProvider {
    private readonly types: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'ALL']
    constructor(private readonly expressApp: Express) {
        bpXml(bp);
        expressApp.use(bp.json());
        // @ts-ignore
        expressApp.use(bp.xml());
        expressApp.use(bp.urlencoded({extended: true}));
        expressApp.use((err, _req, res, _next) => this.exceptionHandler(err, res));
    }

    public boostrapProvider(port: number, cb?: CallbackType) {
        this.expressApp.listen(port, cb);
    }

    public exceptionHandler(_err: Error, res: Response) {
        res.status(500);
        res.send({name: _err.name, message: _err.message, status: 500});
    }

    private multerWrapper(handler: any): any {
        return (req, res, next) => {
            handler(req, res, err => {
                if (err) {
                    this.exceptionHandler(err, res);
                    return;
                }

                next();
            })
        }
    }

    public registerEndpoint(options: EndpointOptions) {
        if (this.types.findIndex(t => t === options.type) === -1) {
            throw new Error(`Method Type ${options.type} not supported`);
        } else {
            const dest = options.fileDestination ? options.fileDestination : '/uploads';
            const upload = multer({dest});

            const addFile = (f: string | FileOption) => {
                if ((f as FileOption).name) {
                    const fo: FileOption = f as FileOption;
                    options.middleware.push(this.multerWrapper(upload.array(fo.name, fo.maxCount)))
                } else {
                    options.middleware.push(this.multerWrapper(upload.single(f as string)));
                }
            }

            if (options.files) {
                if (Array.isArray(options.files)) {
                    (options.files as (FileOption | string)[]).forEach(f => addFile(f));
                } else {
                    addFile(options.files);
                }
            } else {
                options.middleware.push(this.multerWrapper(upload.none()));
            }
            this.expressApp[options.type.toLowerCase()](options.uri, options.middleware, this.makeHandler(options.handler));
        }
    }

    public makeHandler(endpointHandler: HttpExchangeCallbackHandler): RequestHandler  {
        return (req: ExpressRequest, res: ExpressResponse) => {
            endpointHandler(this.makeRequestFromRequest(req), this.makeResponseFromResponse(res))
                .catch(err => {
                    this.exceptionHandler(err, res);
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

export class ExpressProviderFactory implements HttpProviderFactory<ExpressProvider> {
    public makeProvider(options: HttpProviderFactoryOptions) {
        const app = express();
        const provider = new ExpressProvider(app);
        provider.boostrapProvider(options.port, options.onReady);

        return provider;
    }
}

export default {
    factory: ExpressProviderFactory
}