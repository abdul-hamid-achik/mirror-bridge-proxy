import type { Policy } from './policy';
import { decodeJwt } from '@/utils/jwt';
import type { FastifyRequest } from 'fastify';
import { ProxyConfig, type ProxyContext } from '@/config';
import { z } from 'zod';

const JwtDecodePolicyConfigSchema = z.object({
    header: z.string(),
    payload: z.string(),
    context: z.string(),
});

export type JwtDecodePolicyConfig = z.infer<typeof JwtDecodePolicyConfigSchema>;
export class JwtDecodePolicy implements Policy {
    name = 'JwtDecode';

    getConfig(config: ProxyConfig): JwtDecodePolicyConfig {
        const policies = config.policies.find(p => p.name === this.name);
        if (!policies) {
            throw new Error('JwtDecode policy not found');
        }
        return JwtDecodePolicyConfigSchema.parse(policies.config);
    }

    private findInPayload(obj: Record<string, unknown>, path: string): unknown | null {
        return path.split('.').reduce((acc, part) => acc && (acc as never)[part], obj);
    }
    async execute(request: FastifyRequest, config: ProxyConfig, context: ProxyContext): Promise<void> {
        const { header, payload, context: contextKey } = this.getConfig(config);
        const headerName = header.toLowerCase();
        const headerValue = request.headers[headerName] as string;

        if (headerValue) {
            let decoded: Record<string, unknown> | string | null = {};
            if (headerName === "authorization" && payload === "sub") {
                decoded = await decodeJwt<{ sub: string }>(headerValue.replace('Bearer ', '')) as { sub: string };
                decoded = decoded['sub'] as string;
            } else {
                decoded = await decodeJwt<Record<string, unknown>>(headerValue) as Record<string, unknown>;
                decoded = this.findInPayload(decoded, payload) as string;
            }
            context.set(contextKey, decoded);
        }
    }
}
