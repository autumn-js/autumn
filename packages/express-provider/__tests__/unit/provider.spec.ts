import {ExpressProvider, ExpressProviderFactory} from "../../src/express-provider";
import {EndpointOptions, HttpMethod} from "@autumn-js/common";
import express from "express";

const baseOptions: EndpointOptions = {
    type: 'GET',
    uri: '/api/test',
    middleware: [],
    handler: async (req, res) => console.log(req, res)
}

const getExpressAppMock = () => {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        options: jest.fn(),
        all: jest.fn(),
        use: jest.fn(),
        listen: jest.fn()
    }
};

const expressAppGlobal = getExpressAppMock();
jest.mock('express', () => () => expressAppGlobal);

describe('Express Provider', () => {
    let provider: ExpressProvider;
    let expressApp;
    let handlerFn;

    const getOptions = (type: HttpMethod, uri: string = '/api/test'): EndpointOptions => {
        return {...baseOptions, type, uri};
    }

    beforeEach(() => {
        expressApp = getExpressAppMock();
        handlerFn = jest.fn((handler) => () => handler({}, {}));
        provider = new ExpressProvider(expressApp);
        expressApp.use = jest.fn();
        provider.makeHandler = handlerFn;
    });

    const noOtherFunctionsCalled = (called: string) => {
        Object.keys(expressApp)
            .filter(k => k !== called)
            .forEach(k => {
                expect(expressApp[k]).toBeCalledTimes(0);
            })
    }

    const handlerCalled = (options: EndpointOptions) => {
        expect(handlerFn).toHaveBeenCalledWith(options.handler);
    }

    it('Registers a GET Request', () => {
        const options = getOptions('GET');
        provider.registerEndpoint(options);
        expect(expressApp.get).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('get');
        handlerCalled(options);
    });

    it('Registers a POST Request', () => {
        const options = getOptions('POST');
        provider.registerEndpoint(options);
        expect(expressApp.post).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('post')
        handlerCalled(options);
    });

    it('Registers a PUT Request', () => {
        const options = getOptions('PUT');
        provider.registerEndpoint(options);
        expect(expressApp.put).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('put')
        handlerCalled(options);
    });


    it('Registers a PATCH Request', () => {
        const options = getOptions('PATCH');
        provider.registerEndpoint(options);
        expect(expressApp.patch).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('patch')
        handlerCalled(options);
    });


    it('Registers a DELETE Request', () => {
        const options = getOptions('DELETE');
        provider.registerEndpoint(options);
        expect(expressApp.delete).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('delete')
        handlerCalled(options);
    });

    it('Registers a OPTIONS Request', () => {
        const options = getOptions('OPTIONS');
        provider.registerEndpoint(options);
        expect(expressApp.options).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('options')
        handlerCalled(options);
    });

    it('Registers a ALL Request', () => {
        const options = getOptions('ALL');
        provider.registerEndpoint(options);
        expect(expressApp.all).toHaveBeenCalledWith(options.uri, options.middleware, expect.anything());
        noOtherFunctionsCalled('all')
        handlerCalled(options);
    });

    it('Throws error because type not found', () => {
        let options = getOptions('RANDOM' as HttpMethod);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type RANDOM not supported');


        options = getOptions('RANDOM2' as HttpMethod);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type RANDOM2 not supported');

        options = getOptions('HEAD' as HttpMethod);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type HEAD not supported');
    });

    it('should bootstrap express when the provider boostrap method is called', () => {
        const PORT = 3000;
        provider.boostrapProvider(PORT);
        expect(expressApp.listen).toHaveBeenCalledWith(PORT, undefined);

        const cb = () => {
        };
        provider.boostrapProvider(PORT, cb);
        expect(expressApp.listen).toHaveBeenCalledWith(PORT, cb);
    });
});

describe('Express Provider Factory', () => {
    it('should create a express provider with the express app and run the bootstrap', () => {
        const PORT = 3000;
        new ExpressProviderFactory().makeProvider({port: PORT, onReady: undefined});
        expect(expressAppGlobal.listen).toHaveBeenCalledWith(PORT, undefined);

        const cb = () => {};
        new ExpressProviderFactory().makeProvider({port: PORT, onReady: cb});
        expect(expressAppGlobal.listen).toHaveBeenCalledWith(PORT, cb);
    });
});