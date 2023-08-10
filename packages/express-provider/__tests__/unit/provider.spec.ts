import {EndpointOptions, EndpointType, ExpressProvider, ExpressProviderFactory} from "../../src/express-provider";

const baseOptions: EndpointOptions = {
    type: 'GET',
    uri: '/api/test',
    middleware: [],
    handler: (req, res) => console.log(req, res)
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

    const getOptions = (type: EndpointType, uri: string = '/api/test'): EndpointOptions => {
        return {...baseOptions, type, uri};
    }

    beforeEach(() => {
        expressApp = getExpressAppMock();
        provider = new ExpressProvider(expressApp);
    });

    const noOtherFunctionsCalled = (called: string) => {
        Object.keys(expressApp)
            .filter(k => k !== called)
            .forEach(k => {
                expect(expressApp[k]).toBeCalledTimes(0);
            })
    }

    it('Registers a GET Request', () => {
        const options = getOptions('GET');
        provider.registerEndpoint(options);
        expect(expressApp.get).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('get');
    });

    it('Registers a POST Request', () => {
        const options = getOptions('POST');
        provider.registerEndpoint(options);
        expect(expressApp.post).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('post')
    });

    it('Registers a PUT Request', () => {
        const options = getOptions('PUT');
        provider.registerEndpoint(options);
        expect(expressApp.put).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('put')
    });


    it('Registers a PATCH Request', () => {
        const options = getOptions('PATCH');
        provider.registerEndpoint(options);
        expect(expressApp.patch).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('patch')
    });


    it('Registers a DELETE Request', () => {
        const options = getOptions('DELETE');
        provider.registerEndpoint(options);
        expect(expressApp.delete).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('delete')
    });

    it('Registers a OPTIONS Request', () => {
        const options = getOptions('OPTIONS');
        provider.registerEndpoint(options);
        expect(expressApp.options).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('options')
    });

    it('Registers a ALL Request', () => {
        const options = getOptions('ALL');
        provider.registerEndpoint(options);
        expect(expressApp.all).toHaveBeenCalledWith(options.uri, options.middleware, options.handler);
        noOtherFunctionsCalled('all')
    });

    it('Throws error because type not found', () => {
        let options = getOptions('RANDOM' as EndpointType);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type RANDOM not supported');


        options = getOptions('RANDOM2' as EndpointType);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type RANDOM2 not supported');

        options = getOptions('HEAD' as EndpointType);
        expect(() => provider.registerEndpoint(options)).toThrow('Method Type HEAD not supported');
    });

    it('should bootstrap express when the provider boostrap method is called', () => {
        const PORT = 3000;
        provider.boostrapClient(PORT);
        expect(expressApp.listen).toHaveBeenCalledWith(PORT, undefined);

        const cb = () => {
        };
        provider.boostrapClient(PORT, cb);
        expect(expressApp.listen).toHaveBeenCalledWith(PORT, cb);
    });
});

describe('Express Provider Factory', () => {
    it('should create a express provider with the express app and run the bootstrap', () => {
        const PORT = 3000;
        ExpressProviderFactory.makeProvider({port: PORT, onReady: undefined});
        expect(expressAppGlobal.listen).toHaveBeenCalledWith(PORT, undefined);

        const cb = () => {};
        ExpressProviderFactory.makeProvider({port: PORT, onReady: cb});
        expect(expressAppGlobal.listen).toHaveBeenCalledWith(PORT, cb);
    });
});