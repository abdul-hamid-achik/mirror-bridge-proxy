import type { FastifyInstance } from 'fastify';
import fastifyProxy from '@fastify/http-proxy';
import fastifyCors from '@fastify/cors';
import type { ProxyConfig } from './config';
import { PolicyManager } from './policy-manager';

export async function setupProxy(fastify: FastifyInstance, config: ProxyConfig) {
    const policyManager = new PolicyManager();

    // Execute CORS policy if configured
    const corsPolicy = config.policies.find(p => p.name === 'Cors');
    if (corsPolicy) {
        await fastify.register(fastifyCors, corsPolicy.config);
    }

    fastify.log.debug(JSON.stringify(config, null, 2));

    // Setup proxy
    await fastify.register(fastifyProxy, {
        upstream: config.targetUrl,
        prefix: '/',
        rewritePrefix: '/',
        preHandler: async (request, reply) => {
            fastify.log.info('Request received:', request.url);
            await policyManager.executePolicies(request, reply, config.policies.filter(p => p.name !== 'Cors'));
        },
        // Disable handling of OPTIONS method by the proxy
        httpMethods: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'],
        replyOptions: {
            onError: (reply, error) => {
                fastify.log.error('Proxy error:', error);
                reply.status(500).send({ error: 'Proxy error' });
            }
        }
    });
}
