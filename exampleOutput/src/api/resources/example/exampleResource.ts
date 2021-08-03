import { Sequelize } from 'sequelize/types';
import { HTTPErrors } from 'roads-api';

import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';

import {
	buildGetConfig, getWithoutSoftFn,
	partialEditFn, buildPartialEditConfig,
	softDeleteFn, buildDeleteConfig
} from '@api-core/resourceDefaults';

import StarterResource, { TokenResolver } from '@api-core/starterResource';
import { AuthFormat } from '@api-core/tokenResolver';
import { Logger } from '@root/logger';
import { APIConfig } from '@root/api/api';

const { NotFoundError } = HTTPErrors;

export default class ExampleResource extends StarterResource<ExampleRepresentation, Example, AuthFormat> {
	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver<AuthFormat>, config: APIConfig) {
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