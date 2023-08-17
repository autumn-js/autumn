import request from 'supertest';
import {ExpressProvider} from "../../src/express-provider";
import express from "express";

describe('Express Provider Integration Tests', () => {
    let provider: ExpressProvider;
    let app;

    beforeEach(() => {
        app = express();
        provider = new ExpressProvider(app);
    });

    it('should return hello world', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello',
            async handler(_req, res) {
                res.send('Hello World!');
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello');

        expect(res.text).toBe("Hello World!");
    });


    it('should return hello world json', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello',
            async handler(_req, res) {
                res.send({hello: true, world: true});
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello');

        expect(res.body).toHaveProperty('hello');
        expect(res.body).toHaveProperty('world');
    });

    it('should return hello world xml', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello',
            async handler(_req, res) {
                res.contentType('application/xml');
                res.send("<hello>true</hello><world>true</world>");
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello');

        expect(res.type).toBe('application/xml');
        expect(res.text).toBe('<hello>true</hello><world>true</world>');
    });

    it('should handle path params', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello/:id',
            async handler(req, res) {
                res.send({id: req.params.id});
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello/SomeID');

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });


    it('should handle query params', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.queryParams.id});
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello?id=SomeID');

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });


    it('should handle headers', async () => {
        provider.registerEndpoint({
            type: "GET",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.header('X-ID')});
            },
            middleware: []
        });

        const res = await request(app)
            .get('/hello')
            .set('X-ID', 'SomeID');
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });


    it('should handle POST Body', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.body.id});
            },
            middleware: []
        });

        const res = await request(app)
            .post('/hello')
            .send({
                id: 'SomeID'
            });
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });

    it('should handle POST Body XML', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.body.id});
            },
            middleware: []
        });

        const res = await request(app)
            .post('/hello')
            .set('Content-Type', 'application/xml')
            .send("<id>SomeID</id>");
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });

    it('should handle POST Body Form Data', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.body.id});
            },
            middleware: []
        });

        const res = await request(app)
            .post('/hello')
            .field('id', 'SomeID');
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });

    it('should throw Error POST Body Form Data With File no file option', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.body.id});
            },
            middleware: []
        });
        const b = Buffer.from("Test");

        const res = await request(app)
            .post('/hello')
            .field('id', 'SomeID')
            .attach('html', b, {filename: 'test.html'})

        expect(res.status).toBe(500);
        expect(res.body.name).toBe('MulterError');
    });

    it('should handle POST Body UrlEncoded', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello',
            async handler(req, res) {
                res.send({id: req.body.id});
            },
            middleware: []
        });

        const res = await request(app)
            .post('/hello')
            .type('application/x-www-form-urlencoded')
            .send('id=SomeID');
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
    });


    it('should handle PUT Body and PATH', async () => {
        provider.registerEndpoint({
            type: "POST",
            uri: '/hello/:id',
            async handler(req, res) {
                res.send({id: req.body.id, path: req.params.id});
            },
            middleware: []
        });

        const res = await request(app)
            .post('/hello/testPath')
            .send({
                id: 'SomeID'
            });
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('SomeID');
        expect(res.body.path).toBe('testPath');
    });
});