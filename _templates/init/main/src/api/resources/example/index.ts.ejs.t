---
to: src/api/resources/example/index.ts
---
import ExampleResource from './exampleResource';
import ExampleListResource from './exampleListResource';
import * as path from 'path';

import { Router } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../../logger';
import { TokenResolver } from '@root/api/core/starterResource';
import { AuthFormat } from '@root/api/core/tokenResolver';

export function registerAPI (
	router: Router,
	connection: Sequelize,
	logger: Logger,
	tokenResolver: TokenResolver<AuthFormat>,
	config): void {

	connection.import(path.join(__dirname, './exampleModel.js'));
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
	connection.import(path.join(__dirname, './exampleModel.js'));
}