import type { Policy } from './policy';
import fastifyCors from '@fastify/cors';

export class CorsPolicy implements Policy {
    name = 'Cors';

    async execute(fastify: any, config: any): Promise<void> {
        await fastify.register(fastifyCors, config);
    }
}
