import UserResource from './userResource';
import * as path from 'path';
import { Router } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../../logger';
import { TokenResolver } from 'src/api/core/starterResource';

export function registerAPI (
	router: Router,
	connection: Sequelize,
	logger: Logger,
	tokenResolver: TokenResolver,
	config): void {

	connection.import(path.join(__dirname, './users/userModel.js'));

	router.addResource('/users/{remote_id}',
		new UserResource(connection, logger, tokenResolver, config), {
			urlParams: {
				schema: {
					remote_id: {
						type: 'string'
					}
				},
				required: ['remote_id']
			}
		});
}

export function registerInit (connection: Sequelize): void {
	connection.import(path.join(__dirname, './users/userModel.js'));
}


