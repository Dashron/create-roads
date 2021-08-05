import { Logger } from '../logger';
import { Router } from 'roads-api';
import { StarterResourceConfig } from './core/starterResource';
import { Sequelize } from 'sequelize/types';
import { JWTTokenResolver } from './core/tokenResolver';
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
export interface RegisterFn {
    (router: Router, connection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig): void;
}
export declare class API {
    private config;
    private road;
    private router;
    private logger;
    private connection;
    private tokenResolver;
    constructor(config: APIConfig);
    start(): void;
    protected createDbTables(): void;
    protected buildConnection(): Sequelize;
    protected registerProjects(projects: Array<{
        register: RegisterFn;
    }>): void;
}
