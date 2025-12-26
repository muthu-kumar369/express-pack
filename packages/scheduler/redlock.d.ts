declare module "redlock" {
    export default class Redlock {
        constructor(clients: any[], options?: any);
        acquire(resources: string[], ttl: number): Promise<any>;
    }
}
