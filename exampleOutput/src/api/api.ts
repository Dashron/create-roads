import * as fs from 'fs';
import { CorsMiddleware, Response, Road } from 'roads';
import { buildLoggerMiddleware, createLogger, Logger } from '../logger';
import { Router } from 'roads-api';
import { Server } from 'roads-server';
import { StarterResourceConfig } from './core/starterResource';
import * as exampleAPI from './resources/example/index';
import * as usersAPI from './resources/users/index';
import { Sequelize } from 'sequelize';
import { JWTTokenResolver } from './core/tokenResolver';

export interface APIConfig extends StarterResourceConfig {
	cors: {
		origins: Array<string>,
		headers: Array<string>,
		methods: Array<string>,
	},
	db: {
		PGDATABASE: string,
		PGUSER: string,
		PGPASSWORD: string,
		PGHOST: string,
		PGPORT: number,
		PGSSL: string,
	},
	cognito: {
		url: string,
		port: number,
	},
	protocol: 'http' | 'https',
	port: number,
	host: string,
	hostname: string,
	credentials?: {
		privateKey: string,
		certificate: string
	},
	secret: string
}

export interface RegisterFn {
	(
		router: Router,
		connection: Sequelize,
		logger: Logger,
		tokenResolver: JWTTokenResolver,
		config: APIConfig
	): void
}

export class API {
	private config: APIConfig;
	private road: Road;
	private router: Router;
	private logger: Logger;
	private connection: Sequelize;
	private tokenResolver: JWTTokenResolver;

	constructor (config: APIConfig) {
		this.config = config;
		this.road = new Road();
		this.router = new Router();

		// Assign logging middleware
		this.logger = createLogger('api-server');
		this.connection = this.buildConnection();

		this.road.use(buildLoggerMiddleware(this.logger));

		this.road.use(CorsMiddleware.build({
			validOrigins: config.cors.origins,
			requestHeaders: config.cors.headers,
			validMethods: config.cors.methods,
			supportsCredentials: true
		}));

		this.registerProjects([
			exampleAPI,
			usersAPI
		]);

		// Assign initial middleware here
	}

	start (): void {
		this.road.use(this.router.middleware(this.config.protocol, this.config.hostname));
		const log = this.logger;

		let options = undefined;

		// Configure server certificates
		if (this.config.credentials) {
			options = {
				key: fs.readFileSync(this.config.credentials.privateKey).toString(),
				cert: fs.readFileSync(this.config.credentials.certificate).toString()
			};
		}

		// Create the server
		const server = new Server(this.road, function (err: Error) {
			log.error(err);
			return new Response('Unknown Error', 500);
		}, options);

		// Start the server
		server.listen(this.config.port, this.config.host);
	}

	protected createDbTables () {
		this.connection.sync();
	}

	protected buildConnection() {
		return new Sequelize(this.config.db.PGDATABASE, this.config.db.PGUSER, this.config.db.PGPASSWORD, {
			host: this.config.db.PGHOST,
			dialect: 'postgres',
			port: this.config.db.PGPORT,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000
			},
			dialectOptions: {
				ssl: {
					rejectUnauthorized: true,
					ca: fs.readFileSync(this.config.db.PGSSL).toString()
				},
			}
		});
	}

	protected registerProjects (projects: Array<{ register: RegisterFn }>): void {
		projects.forEach(project => {
			project.register(this.router, this.connection, this.logger, this.tokenResolver, this.config);
		});
	}
}