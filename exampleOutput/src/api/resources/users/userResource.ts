import { User } from './userModel';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';
import { HTTPErrors, CONSTANTS } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import UserRepresentation from './userRepresentation';
import { Logger } from '../../../logger';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { APIConfig } from '../../api';
import { Request } from 'roads';

const { NotFoundError, ForbiddenError, InvalidRequestError } = HTTPErrors;
const { MEDIA_JSON, MEDIA_JSON_MERGE, AUTH_BEARER } = CONSTANTS;


export default class UserResource extends StarterResource<UserRepresentation, User, AuthFormat | undefined> {
	constructor(dbConnection: Sequelize,
		logger: Logger,
		tokenResolver: JWTTokenResolver,
		config: APIConfig) {

		super(dbConnection, logger, tokenResolver, config);

		const commonConfig = {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			defaultResponseMediaType: MEDIA_JSON,
			defaultRequestMediaType: MEDIA_JSON_MERGE,
			authRequired: true
		}

		/**
		 * This endpoint is how new users are registered via an AWS Cognito ID.
		 * todo: Do we want this to be remote ID or email in the url? if the remote Id exists we want to replace, but the email
		 * should get priority.
		 * - I think if the email exists and the remote id is different we should change the remote id (check cognito, can this happen?)
		 * - I think if the remote ID exists and the email doesn't, we should.... what? ugh. TODO: later
		 */
		this.addAction('fullReplace', async (
			models,
			requestBody: UserRepresentation & { accessToken: string },
			requestMediaHandler,
			auth) => {

			if (!requestBody || !requestBody.accessToken) {
				throw new InvalidRequestError('Credentials must be provided for this user');
			}

			// Ensure that the user being registered via amazon cognito actually exists in amazon cognito.
			// This is a lightweight check to ensure all data to this endpoint is valid, as opposed to forcing
			//		some form of authentication on this endpoint
			// Note: Should this be part of the representation validation?
			//		e.g. access token is only valid if I can make this external request
			const cognitoRequest = new Request(true, config.cognito.url, config.cognito.port);
			const authResponse = await cognitoRequest.request('GET', '/oauth2/userInfo', undefined, {
				authorization: `Bearer ${requestBody.accessToken}`
			});

			const parsedResponse = JSON.parse(authResponse.body);
			if (authResponse.status != 200 || parsedResponse.sub != models.remoteId) {
				throw new InvalidRequestError('Invalid credentials provided for this user');
			}

			if (requestMediaHandler) {
				await requestMediaHandler.applyEdit(requestBody, models, auth);
				models.source = 'aws-cognito';
				return models.save();
			}
		}, {
			...commonConfig,
			requestMediaTypes: { [MEDIA_JSON]: new UserRepresentation('fullReplace') },
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('fullReplace') },
			// todo: currently we just validate that the passed access token is legit. We should require
			//		a client access token here too for stronger regulation
			authRequired: false
		});

		this.addAction('partialEdit', (models, requestBody, requestMediaHandler, auth) => {

			// auth is valid if we get to this point, but I'm checking for auth here to protect against bugs
			// this would be a good location to check auth roles
			if (!auth || auth.id != models.id) {
				throw new ForbiddenError('You do not have permission to manipulate this resource');
			}

			if (requestMediaHandler) {
				requestMediaHandler.applyEdit(requestBody, models, auth);
				return models.save();
			}
		}, {
			...commonConfig,
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('get') },
			requestMediaTypes: { [MEDIA_JSON_MERGE]: new UserRepresentation('partialEdit') },
		});

		this.addAction('get', (models, requestBody, requestMediaHandler, auth) => {
			// You can only view your own user page
			if (!auth || auth.id != models.id) {
				throw new ForbiddenError('You do not have permission to view this resource');
			}
		}, {
			...commonConfig,
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('get') },
		});

		this.addAction('delete', (models, requestBody, requestMediaHandler, auth) => {
			// auth is valid if we get to this point, but I'm checking for auth here to protect against bugs
			// this would be a good dbConnection to check auth roles
			console.log('role', auth ? auth.role : 'no auth');
			if (!auth || auth.role !== 'admin') {
				throw new ForbiddenError('You do not have permission to manipulate this resource');
			}

			models.active = 0;
			return models.save();
		}, {
			...commonConfig,
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('delete') },
		});
	}

	async modelsResolver(
		urlParams: ParsedURLParams | undefined,
		searchParams: URLSearchParams | undefined,
		action: keyof ActionList,
		pathname: string): Promise<User> {

		if (!urlParams?.remote_id) {
			throw new NotFoundError('User not found');
		}

		const user = await User.findOne({
			where: {
				remoteId: urlParams.remote_id
			}
		});

		if (user) {
			return user;
		}

		if (action === 'fullReplace') {
			return User.build({
				remoteId: String(urlParams.remote_id),
				active: 1
			});
		}

		throw new NotFoundError('User not found');
	}
}