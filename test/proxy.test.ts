import { startMockServer } from './mock-server';
import { loadConfig } from '@/config';
import { setupProxy } from '@/proxy';
import Fastify from 'fastify';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const TEST_PORT = 3001;
const MOCK_SERVER_PORT = 8082;

describe('Proxy Tests', () => {
    let fastify: any;
    let mockServer: any;

    beforeAll(async () => {
        // Start mock server
        mockServer = await startMockServer(MOCK_SERVER_PORT);

        // Set up proxy
        process.env.CONFIG_FILE = './test/config.yaml';
        const config = loadConfig();
        fastify = Fastify();
        await setupProxy(fastify, config);
        await fastify.listen({ port: TEST_PORT });
    });

    afterAll(async () => {
        await fastify.close();
        await mockServer.close();
    });

    it('should forward requests and transform headers', async () => {
        const token = jwt.sign({ sub: 'testuser' }, 'secret');
        const response = await fetch(`http://localhost:${TEST_PORT}/test`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect((data as any).headers['x-forwarded-user']).toBe('testuser');
        expect((data as any).headers['x-custom-header']).toBe('TestValue');
    });

    it('should handle CORS', async () => {
        const response = await fetch(`http://localhost:${TEST_PORT}/test`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://example.com',
                'Access-Control-Request-Method': 'GET'
            }
        });

        expect(response.headers.get('access-control-allow-origin')).toBe('*');
        expect(response.headers.get('access-control-allow-methods')).toContain('GET');
    });

    it('should forward POST requests with body', async () => {
        const response = await fetch(`http://localhost:${TEST_PORT}/echo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ test: 'data' })
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect((data as any).body).toEqual({ test: 'data' });
    });
});
