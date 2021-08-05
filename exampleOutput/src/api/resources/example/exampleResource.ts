import { Sequelize } from 'sequelize/types';
import { HTTPErrors } from 'roads-api';

import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';

import {
	getWithoutSoftFn,
	partialEditFn,
	softDeleteFn
} from '@api-core/resourceDefaults';

import StarterResource from '@api-core/starterResource';
import { AuthFormat, JWTTokenResolver } from '@api-core/tokenResolver';
import { Logger } from '@src/logger';
import { APIConfig } from '@src/api/api';
import { AUTH_BEARER, MEDIA_JSON, MEDIA_JSON_MERGE } from 'roads-api/types/core/constants';

const { NotFoundError } = HTTPErrors;

export default class ExampleResource extends StarterResource<ExampleRepresentation, Example, AuthFormat> {
	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig) {
		super(dbConnection, logger, tokenResolver, config);
		this.addAction('get', getWithoutSoftFn, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			responseMediaTypes: { [MEDIA_JSON]: new ExampleRepresentation('get') },
			defaultResponseMediaType: MEDIA_JSON,
			defaultRequestMediaType: MEDIA_JSON,
			authRequired: false
		});

		this.addAction('partialEdit', partialEditFn, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			requestMediaTypes: { [MEDIA_JSON_MERGE]: new ExampleRepresentation('partialEdit') },
			defaultRequestMediaType: MEDIA_JSON_MERGE,
			authRequired: true,
			responseMediaTypes: { [MEDIA_JSON]: new ExampleRepresentation('partialEdit') },
			defaultResponseMediaType: MEDIA_JSON
		});

		this.addAction('delete', softDeleteFn, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			authRequired: true,
			responseMediaTypes: { [MEDIA_JSON]: new ExampleRepresentation('delete') },
			defaultResponseMediaType: MEDIA_JSON,
			defaultRequestMediaType: MEDIA_JSON
		});
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