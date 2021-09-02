import { Sequelize } from 'sequelize/types';

import { User } from './userModel';
import UserRepresentation, { UserFormat } from './userRepresentation';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { Logger } from '../../../logger';
import { APIConfig } from '../../api';
import CollectionRepresentation from '../../core/collectionRepresentation';

import { CONSTANTS, HTTPErrors } from 'roads-api';
const { ForbiddenError, InvalidRequestError } = HTTPErrors;
const { AUTH_BEARER, MEDIA_JSON } = CONSTANTS;

import { ActionList, ParsedURLParams } from 'roads-api/types/Resource/resource';

type UserCollection = { users?: Array<User> };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCollectionRepresentation extends CollectionRepresentation<
	UserFormat,
	User,
	AuthFormat
> {}

export default class UserListResource extends StarterResource<UserCollectionRepresentation,
	User | UserCollection, AuthFormat> {

	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig) {
		super(dbConnection, logger, tokenResolver, config);

		this.addAction('get', () => {
			return;
		}, {
			authRequired: true,
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			responseMediaTypes: {
				[MEDIA_JSON]: new CollectionRepresentation('get',
					new UserRepresentation('get-list'), ( models: { users: Array<User> } ) => {
						return models.users;
					}
				)
			},
			defaultResponseMediaType: MEDIA_JSON
		});

		/**
		 * TODO: The user model should record the email address, and append should allow you
		 * to provide an initial email address. User registration can then check to see if
		 * an email exists first, and if so update that record with the new representation
		 * data instead of creating a new one
		 */
		this.addAction('append', async (
			models: User,
			requestBody,
			requestMediaHandler,
			auth
		) => {

			if (!auth) {
				throw new ForbiddenError('You do not have permission to create new users');
			}

			if (!requestMediaHandler) {
				throw new InvalidRequestError('You must provide a request body');
			}

			await requestMediaHandler.applyEdit(requestBody, models, auth);
			models.active = 0;
			models.source = 'manual';
			return models.save();
		}, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			requestMediaTypes: { [MEDIA_JSON]: new UserRepresentation('append') },
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('append') },
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
	): Promise<User | { users?: Array<User> }> {

		if (action === 'append') {
			return User.build();
		}

		const models: {
			users?: Array<User>
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

		models.users = await User.findAll({
			limit: models.perPage,
			offset: models.perPage * models.page,
			order: [['createdAt', 'DESC']]
		});

		return models;
	}
}