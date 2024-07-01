
import type { FastifyInstance } from 'fastify';
import fastifyProxy from '@fastify/http-proxy';
import type { ProxyConfig } from './config';
import { PolicyManager } from './policy-manager';

export async function setupProxy(fastify: FastifyInstance, config: ProxyConfig) {
    const policyManager = new PolicyManager();

    await fastify.register(fastifyProxy, {
        upstream: config.targetUrl,
        proxyPayloads: true,
        preHandler: async (request, reply) => {
            await policyManager.executePolicies(request, reply, config);
        },
        httpMethods: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'],
    });
}
