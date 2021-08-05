import { Sequelize } from 'sequelize/types';

import { Example } from './exampleModel';
import ExampleRepresentation, { ExampleFormat } from './exampleRepresentation';
import StarterResource from '@api-core/starterResource';
import { AuthFormat, JWTTokenResolver } from '@api-core/tokenResolver';
import { Logger } from '@src/logger';
import { APIConfig } from '@src/api/api';
import CollectionRepresentation from '@api-core/collectionRepresentation';
import { ForbiddenError } from 'roads-api/types/core/httpErrors';
import { AUTH_BEARER, MEDIA_JSON } from 'roads-api/types/core/constants';
import { ActionList, ParsedURLParams } from 'roads-api/types/Resource/resource';

type ExampleCollection = { examples?: Array<Example> };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExampleCollectionRepresentation extends CollectionRepresentation<
	ExampleFormat,
	Example,
	AuthFormat
> {}

export default class ExampleListResource extends StarterResource<ExampleCollectionRepresentation,
	Example | ExampleCollection, AuthFormat> {

	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig) {
		super(dbConnection, logger, tokenResolver, config);

		this.addAction('get', () => {
			return;
		}, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			responseMediaTypes: {
				[MEDIA_JSON]: new CollectionRepresentation('get',
					new ExampleRepresentation('get'), ( models: {examples: Array<Example>} ) => {
						return models.examples;
					}
				)
			}
		});

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
		}, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			requestMediaTypes: { [MEDIA_JSON]: new ExampleRepresentation('append') },
			responseMediaTypes: { [MEDIA_JSON]: new ExampleRepresentation('append') },
			defaultRequestMediaType: MEDIA_JSON,
			defaultResponseMediaType: MEDIA_JSON,
			authRequired: true
		});

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