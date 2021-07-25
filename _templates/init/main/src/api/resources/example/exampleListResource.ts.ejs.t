---
to: src/api/resources/example/exampleListResource.ts
---
import { Sequelize } from 'sequelize/types';

import { StarterResource, Logger } from 'roads-starter';
import { APIProjectConfig, TokenResolver } from 'roads-starter/types/api/apiProject';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';

import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';
import { buildGetListConfig, appendFn, buildAppendConfig } from '../resourceDefaults';

export default class ExampleListResource extends StarterResource {
	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig) {
		super(dbConnection, logger, tokenResolver, config);

		this.addAction('get', () => {
			return;
		}, buildGetListConfig(tokenResolver, ExampleRepresentation, (models: {examples: Array<Example>}) => {
			return models.examples;
		}));

		this.addAction('append', appendFn, buildAppendConfig(tokenResolver, ExampleRepresentation));

		this.setSearchSchema({
			per_page: {
				type: 'number'
			},
			page: {
				type: 'number'
			}
		});
	}

	async modelsResolver(urlParams: ParsedURLParams | undefined,
		searchParams: URLSearchParams | undefined,
		action: keyof ActionList,
		pathname: string, auth: { id: string }): Promise<Example | { examples?: Array<Example> }> {

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