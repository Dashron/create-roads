import ExampleResource from './exampleResource';
import ExampleListResource from './exampleListResource';
import { Router } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../../logger';
import { JWTTokenResolver } from '@root/api/core/tokenResolver';
import { APIConfig } from '@root/api/server';
import registerExampleModel from './exampleModel';

export function registerAPI (
	router: Router,
	connection: Sequelize,
	logger: Logger,
	tokenResolver: JWTTokenResolver,
	config: APIConfig): void {

	registerExampleModel(connection);
	router.addResource('/examples', new ExampleListResource(connection, logger, tokenResolver, config));
	router.addResource('/examples/{example_id}',
		new ExampleResource(connection, logger, tokenResolver, config), {
			urlParams: {
				schema: {
					example_id: {
						type: 'number'
					}
				},
				required: ['example_id']
			}
		});
}

export function registerInit (connection: Sequelize): void {
	registerExampleModel(connection);
}