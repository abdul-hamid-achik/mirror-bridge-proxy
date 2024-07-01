import Fastify from 'fastify';
import { loadConfig } from './config';
import { setupProxy } from './proxy';

const fastify = Fastify({ logger: true });

async function main() {
    try {
        const config = loadConfig();
        await setupProxy(fastify, config);
        await fastify.listen({ port: config.sourcePort, host: '0.0.0.0' });
    } catch (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
}

main();

