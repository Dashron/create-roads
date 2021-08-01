---
to: src/api/resources/example/exampleListResource.ts
---
import { Sequelize } from 'sequelize/types';

import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';

import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';
import { buildGetListConfig, buildAppendConfig } from '@api-core/resourceDefaults';
import StarterResource, { TokenResolver } from '@api-core/starterResource';
import { AuthFormat } from '@api-core/tokenResolver';
import { Logger } from '@root/logger';
import { APIConfig } from '@root/api/server';
import CollectionRepresentation from '@api-core/collectionRepresentation';
import { ForbiddenError } from 'roads-api/types/core/httpErrors';

type ExampleCollection = { examples?: Array<Example> };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExampleCollectionRepresentation extends CollectionRepresentation<
	ExampleRepresentation,
	Example,
	AuthFormat
> {}

export default class ExampleListResource extends StarterResource<ExampleCollectionRepresentation,
	Example | ExampleCollection, AuthFormat> {

	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver<AuthFormat>, config: APIConfig) {
		super(dbConnection, logger, tokenResolver, config);

		this.addAction('get', () => {
			return;
		}, buildGetListConfig(tokenResolver, ExampleRepresentation, (models: {examples: Array<Example>}) => {
			return models.examples;
		}));

		this.addAction('append', async (
			models: Example,
			requestBody,
			requestMediaHandler,
			auth
		) => {

			if (!auth) {
				throw new ForbiddenError('You do not have permission to manipulate this resource');
			}

			if (requestMediaHandler) {
				await requestMediaHandler.applyEdit(requestBody, models, auth);
			}
			models.ownerId = auth.id;
			models.active = 1;
			return models.save();
		}, buildAppendConfig(tokenResolver, ExampleRepresentation));

		this.setSearchSchema({
			per_page: {
				type: 'number'
			},
			page: {
				type: 'number'
			}
		});
	}

	async modelsResolver(
		urlParams: ParsedURLParams | undefined,
		searchParams: URLSearchParams | undefined,
		action: keyof ActionList,
		pathname: string,
		auth: AuthFormat
	): Promise<Example | { examples?: Array<Example> }> {

		if (action === 'append') {
			return Example.build();
		}

		const models: {
			examples?: Array<Example>
			perPage: number,
			page: number
		} = {
			perPage: 10,
			page: 0
		};

		if (searchParams) {
			if (searchParams.has('per_page')) {
				models.perPage = Number(searchParams.get('per_page'));
			}

			if (searchParams.has('page')) {
				models.page = Number(searchParams.get('page'));
			}
		}

		if (!auth) {
			return {};
		}

		models.examples = await Example.findAll({
			limit: models.perPage,
			offset: models.perPage * models.page,
			where: {
				ownerId: auth.id,
				active: 1
			},
			order: [['createdAt', 'DESC']]
		});

		return models;
	}
}