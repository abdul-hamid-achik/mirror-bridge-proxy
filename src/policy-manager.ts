import type { Policy } from './policies/policy';
import { JwtDecodePolicy } from './policies/jwt-decode-policy';
import { HeaderTransformPolicy } from './policies/header-transform-policy';
import { CorsPolicy } from './policies/cors-policy';
import type { FastifyRequest, FastifyReply } from 'fastify';
export class PolicyManager {
    private policies: Map<string, Policy> = new Map();

    constructor() {
        this.registerPolicy(new JwtDecodePolicy());
        this.registerPolicy(new HeaderTransformPolicy());
        this.registerPolicy(new CorsPolicy());
    }

    registerPolicy(policy: Policy) {
        this.policies.set(policy.name, policy);
    }

    async executePolicies(request: FastifyRequest, reply: FastifyReply, policyConfigs: any[]): Promise<void> {
        for (const policyConfig of policyConfigs) {
            const policy = this.policies.get(policyConfig.name);
            if (policy) {
                try {
                    request.log.info(`Executing policy: ${policyConfig.name}`);
                    await policy.execute(request, policyConfig.config);
                } catch (error) {
                    request.log.error(`Policy ${policyConfig.name} execution failed:`, error);
                    reply.status(500).send({ error: `Policy ${policyConfig.name} execution failed` });
                    return;
                }
            }
        }
    }
}
