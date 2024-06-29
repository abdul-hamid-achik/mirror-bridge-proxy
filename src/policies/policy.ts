export interface Policy {
    name: string;
    execute(request: any, config: any): Promise<void>;
}
