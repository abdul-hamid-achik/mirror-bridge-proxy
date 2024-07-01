import type { FastifyRequest } from 'fastify';
import type { Policy } from './policy';
import { ProxyConfig } from '@/config';
import { z } from 'zod';

const CorsPolicyConfigSchema = z.object({
    origin: z.string(),
    methods: z.array(z.string()),
    credentials: z.boolean(),
});

export type CorsPolicyConfig = z.infer<typeof CorsPolicyConfigSchema>;

export class CorsPolicy implements Policy {
    name = 'Cors';

    getConfig(config: ProxyConfig): CorsPolicyConfig {
        const policies = config.policies.find(p => p.name === this.name);

        if (!policies) {
            throw new Error('Cors policy not found');
        }

        return CorsPolicyConfigSchema.parse(policies.config);
    }

    async execute(request: FastifyRequest, config: ProxyConfig): Promise<void> {
        const { origin, methods, credentials } = this.getConfig(config);

        request.headers['Access-Control-Allow-Origin'] = origin || '*';
        request.headers['Access-Control-Allow-Methods'] = methods.join(', ') || '*';
        request.headers['Access-Control-Allow-Headers'] = '*';

        if (credentials) {
            request.headers['Access-Control-Allow-Credentials'] = 'true';
        }
    }
}
