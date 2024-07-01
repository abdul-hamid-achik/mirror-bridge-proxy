import type { Policy, } from './policies/policy';
import { JwtDecodePolicy } from './policies/jwt-decode-policy';
import { HeaderTransformPolicy } from './policies/header-transform-policy';
import { CorsPolicy } from './policies/cors-policy';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProxyConfig } from './config';

export class PolicyManager {
    private policies: Policy[] = [
        new CorsPolicy(),
        new JwtDecodePolicy(),
        new HeaderTransformPolicy(),
    ];

    async executePolicies(request: FastifyRequest, reply: FastifyReply, config: ProxyConfig): Promise<void> {
        const context: Map<string, unknown> = new Map();

        for (const policy of this.policies) {
            await policy.execute(request, config, context);
        }
    }
}
