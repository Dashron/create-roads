import * as exampleAPI from '@root/api/resources/example/index';
import * as usersAPI from '@root/api/resources/users/index';
import { Router } from 'roads-api';

const enabledProjects = [
	exampleAPI,
	usersAPI
];

export function registerRoutes (router: Router): void {
	enabledProjects.forEach(project => {
		project.registerAPI(router, connection, logger, tokenResolver, config);
	});
}

export function registerInit (router: Router): void {
	enabledProjects.forEach(project => {
		project.registerInit(router, connection, logger, tokenResolver, config);
	});
}

function connection() {
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