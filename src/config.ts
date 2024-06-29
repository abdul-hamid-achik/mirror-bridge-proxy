import fs from 'fs';
import YAML from 'yamljs';

export interface ProxyConfig {
    sourcePort: number;
    targetUrl: string;
    policies: Array<{
        name: string;
        config: any;
    }>;
}

export function loadConfig(): ProxyConfig {
    const configPath = process.env.CONFIG_FILE || './config/default.yaml';

    try {
        const config = YAML.load(configPath) as ProxyConfig;

        if (!config.sourcePort || !config.targetUrl) {
            throw new Error('Config must include sourcePort and targetUrl');
        }

        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        process.exit(1);
    }
}
