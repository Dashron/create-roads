import { Sequelize } from 'sequelize/types';
import { HTTPErrors } from 'roads-api';
import { StarterResource, Logger } from 'roads-starter';
import { APIProjectConfig, TokenResolver } from 'roads-starter/types/api/apiProject';

import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';

import {
	buildGetConfig, getWithoutSoftFn,
	partialEditFn, buildPartialEditConfig,
	softDeleteFn, buildDeleteConfig
} from '../resourceDefaults';

const { NotFoundError } = HTTPErrors;

export default class ExampleResource extends StarterResource {
	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig) {
		super(dbConnection, logger, tokenResolver, config);
		this.addAction('get', getWithoutSoftFn, buildGetConfig(tokenResolver, ExampleRepresentation));
		this.addAction('partialEdit', partialEditFn, buildPartialEditConfig(tokenResolver, ExampleRepresentation));
		this.addAction('delete', softDeleteFn, buildDeleteConfig(tokenResolver, ExampleRepresentation));
	}

	async modelsResolver(urlParams: { example_id: number }): Promise<Example> {
		const example = await Example.findOne({
			where: {
				id: urlParams.example_id
			}
		});

		if (example) {
			return example;
		}

		throw new NotFoundError('Example not found');
	}
}