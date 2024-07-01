import { ProxyConfig, ProxyContext } from "@/config";
import { FastifyRequest } from "fastify";
import { CorsPolicyConfig } from "./cors-policy";
import { HeaderTransformPolicyConfig } from "./header-transform-policy";
import { JwtDecodePolicyConfig } from "./jwt-decode-policy";


export type PolicyConfig = CorsPolicyConfig | HeaderTransformPolicyConfig | JwtDecodePolicyConfig;

export interface Policy {
    name: string;
    execute(request: FastifyRequest, config: ProxyConfig, context: ProxyContext): Promise<void>;
    getConfig(config: ProxyConfig): PolicyConfig;
}
