import { ProxyConfig, ProxyContext } from '@/config';
import type { Policy } from './policy';
import { transformHeaders } from '@/utils/headers';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

const HeaderTransformPolicyConfigSchema = z.record(z.string(), z.string());

export type HeaderTransformPolicyConfig = z.infer<typeof HeaderTransformPolicyConfigSchema>;

export class HeaderTransformPolicy implements Policy {
    name = 'HeaderTransform';

    getConfig(config: ProxyConfig): HeaderTransformPolicyConfig {
        const policies = config.policies.find(p => p.name === this.name);
        if (!policies) {
            throw new Error('HeaderTransform policy not found');
        }
        return HeaderTransformPolicyConfigSchema.parse(policies.config);
    }
    private getContextValue(context: ProxyContext, key: string): string {
        return context.get(key) as string || '';
    }

    private interpolateContextValues(context: ProxyContext, value: string): string {
        return value.replace(/\$\{(.*?)\}/g, (_, v) => this.getContextValue(context, v));
    }

    async execute(request: FastifyRequest, config: ProxyConfig, context: ProxyContext): Promise<void> {
        const headersConfig = this.getConfig(config);
        const transformedHeaders = Object.fromEntries(
            Object.entries(headersConfig).map(([key, value]) => {
                if (value.startsWith('${') && value.endsWith('}')) {
                    const interpolatedValue = this.interpolateContextValues(context, value);
                    return [key, interpolatedValue];
                } else {
                    return [key, value];
                }
            })
        ) as Record<string, string>;

        await transformHeaders(request.headers as Record<string, string>, transformedHeaders);
    }
}
