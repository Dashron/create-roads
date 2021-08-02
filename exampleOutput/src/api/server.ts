import * as fs from 'fs';
import { CorsMiddleware, Response, Road } from 'roads';
import { buildLoggerMiddleware, createLogger, Logger } from '../logger';
import { Router } from 'roads-api';
import { Server } from 'roads-server';
import activeRoutes from './activeRoutes';
import { StarterResourceConfig } from './core/starterResource';

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
	credentials: {
		privateKey: string,
		certificate: string
	},
	secret: string
}

export class API {
	private config: APIConfig;
	private road: Road;
	private router: Router;
	private logger: Logger;

	constructor (config: APIConfig) {
		this.config = config;
		this.road = new Road();
		this.router = new Router();

		// Assign logging middleware
		this.logger = createLogger('api-server');
		this.road.use(buildLoggerMiddleware(this.logger));

		this.road.use(CorsMiddleware.build({
			validOrigins: config.cors.origins,
			requestHeaders: config.cors.headers,
			validMethods: config.cors.methods,
			supportsCredentials: true
		}));

		activeRoutes(this.router);

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

	createDbTables () {
		this.connection().sync();
	}


	/*addModel(path: string) {
		this.connection.import(path);
	}

	addResource(path: string, resource: StarterResourceConstructor, templateSchema?: any) {
		this.router.addResource(path,
			new resource(this.connection, this.logger, this.tokenResolver, this.config), templateSchema);
	}

	addTokenResolver(resolverBuilder: (connection: Sequelize, logger: Logger, config: APIProjectConfig) => TokenResolver) {
		this.tokenResolver = resolverBuilder(this.connection, this.logger, this.config);
	}*/
}