---
to: src/api/resources/users/index.ts
---
import UserResource from './userResource';
import { Router } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../../logger';
import registerUserModel from './userModel';
import { APIConfig } from '@root/api/server';
import { JWTTokenResolver } from '@root/api/core/tokenResolver';

export function registerAPI (
	router: Router,
	connection: Sequelize,
	logger: Logger,
	tokenResolver: JWTTokenResolver,
	config: APIConfig): void {

	registerUserModel(connection);

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
	registerUserModel(connection);
}


