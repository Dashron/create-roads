import { StarterResourceConfig } from './core/starterResource';
export interface APIConfig extends StarterResourceConfig {
    cors: {
        origins: Array<string>;
        headers: Array<string>;
        methods: Array<string>;
    };
    db: {
        PGDATABASE: string;
        PGUSER: string;
        PGPASSWORD: string;
        PGHOST: string;
        PGPORT: number;
        PGSSL: string;
    };
    cognito: {
        url: string;
        port: number;
    };
    protocol: 'http' | 'https';
    port: number;
    host: string;
    hostname: string;
    credentials: {
        privateKey: string;
        certificate: string;
    };
    secret: string;
}
export declare class API {
    private config;
    private road;
    private router;
    private logger;
    constructor(config: APIConfig);
    start(): void;
    createDbTables(): void;
}
