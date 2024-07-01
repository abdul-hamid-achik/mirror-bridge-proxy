import { startMockServer } from './mock-server';
import { loadConfig } from '@/config';
import { setupProxy } from '@/proxy';
import Fastify, { type FastifyInstance } from 'fastify';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { type Server } from 'http';

const TEST_PORT = 3001;
const MOCK_SERVER_PORT = 8082;

describe('Proxy Tests', () => {
    let fastify: FastifyInstance;
    let mockServer: Server;

    beforeAll(async () => {
        mockServer = await startMockServer(MOCK_SERVER_PORT);

        process.env.CONFIG_FILE = './test/config.yaml';

        const config = loadConfig();

        fastify = Fastify();

        await setupProxy(fastify, config);
        await fastify.listen({ port: TEST_PORT });

    });

    afterAll(async () => {
        await fastify.close();
        mockServer.close();
    });

    it('should forward requests and transform headers', async () => {
        const request = supertest(mockServer);
        const token = jwt.sign({ sub: 'testuser' }, 'secret');
        const response = await request.get('/test')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.headers['X-Forwarded-User']).toBe('testuser');
        expect(response.body.headers['x-custom-header']).toBe('TestValue');
    });

    it('should handle CORS', async () => {
        const request = supertest(mockServer);
        const response = await request.options('/test')
            .set('Origin', 'http://example.com')
            .set('Access-Control-Request-Method', 'GET');

        expect(response.headers['access-control-allow-origin']).toBe('*');
        expect(response.headers['access-control-allow-methods']).toContain('GET');
    });

    it('should forward POST requests with body', async () => {
        const request = supertest(mockServer);
        const response = await request.post('/echo')
            .send({ test: 'data' })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.body).toEqual({ test: 'data' });
    });
});
