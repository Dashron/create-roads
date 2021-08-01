---
to: src/api/core/index.ts
---
import config as configModule from '../../config';
const ENVIRONMENT = process.env.ROADS_ENV || 'default';
const configData = configModule(`${__dirname  }/../config`, ENVIRONMENT);

import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import { Road } from 'roads';

interface APIConfig {
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

	constructor (config: APIConfig) {
		this.config = config;
		this.road = new Road();
		// Assign initial middleware here
		road.use(buildLoggerMiddleware('apiServer'));

		road.use(CorsMiddleware.build({
			validOrigins: config.corsOrigins,
			requestHeaders: config.corsHeaders,
			validMethods: config.corsMethods,
			supportsCredentials: true
		}));

		const router = new Router();
	}

	start () {
		this.road.use(this.router.middleware(this.config.protocol, this.config.hostname));
		const log = this.logger;

		let options = undefined;

		if (this.config.credentials) {
			options = {
				key: fs.readFileSync(this.config.credentials.privateKey).toString(),
				cert: fs.readFileSync(this.config.credentials.certificate).toString()
			};
		}

		const server = new Server(this.road, function (err: Error) {
			log.error(err);
			return new Response('Unknown Error', 500);
		}, options);

		server.listen(this.config.port, this.config.host);
	}

	private connection() {
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