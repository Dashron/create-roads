import { User } from './userModel';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';
import { HTTPErrors, CONSTANTS } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import UserRepresentation from './userRepresentation';
import { Logger } from '../../../logger';
import StarterResource, { TokenResolver } from '../../core/starterResource';
import { AuthFormat } from '../../core/tokenResolver';
import { APIConfig } from '../../server';

const { NotFoundError, ForbiddenError } = HTTPErrors;
const { MEDIA_JSON, MEDIA_JSON_MERGE, AUTH_BEARER } = CONSTANTS;


export default class UserResource extends StarterResource<UserRepresentation, User, AuthFormat> {
	constructor(dbConnection: Sequelize,
		logger: Logger,
		tokenResolver: TokenResolver<AuthFormat>,
		config: APIConfig) {

		super(dbConnection, logger, tokenResolver, config);

		// todo: I don't know what the purpose of this endpoint is?
		/*this.addAction('fullReplace', async (
			models,
			requestBody,
			requestMediaHandler,
			auth) => {

			if (!requestBody || !requestBody.accessToken) {
				throw new InvalidRequestError('Credentials must be provided for this user');
			}

			// Ensure that the user being registered via amazon cognito actually exists in amazon cognito.
			// This is a lightweight check to ensure all data to this endpoint is valid, as opposed to forcing
			//		some form of authentication on this endpoint
			// Note: this might be better as a part of the userRepresentation Validation. Maybe a new "validate multi"
			//		function or something.
			const cognitoRequest = new Request(true, config.cognito.url, config.cognito.port);
			const authResponse = await cognitoRequest.request('GET', '/oauth2/userInfo', undefined, {
				authorization: `Bearer ${  requestBody.accessToken}`
			});

			const parsedResponse = JSON.parse(authResponse.body);
			if (authResponse.status != 200 || parsedResponse.sub != models.remoteId) {
				throw new InvalidRequestError('Invalid credentials provided for this user');
			}

			if (requestMediaHandler) {
				await requestMediaHandler.applyEdit(requestBody, models, auth);
				return models.save();
			}
		}, {
			authSchemes: { [ AUTH_BEARER ]: tokenResolver },
			requestMediaTypes: { [MEDIA_JSON]: new UserRepresentation('fullReplace') },
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('fullReplace') },
			defaultRequestMediaType: MEDIA_JSON,
			defaultResponseMediaType: MEDIA_JSON,
			// todo: currently we just validate that the user id exists. this makes it hard to create users without
			//		 getting amazon involved
			// ideally as an extra step we would require auth on this, and force clients to get a client auth token
			//		before adding users.
			authRequired: false
		});*/

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
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('get') },
			defaultResponseMediaType: MEDIA_JSON,
			requestMediaTypes: { [MEDIA_JSON_MERGE]: new UserRepresentation('partialEdit') },
			defaultRequestMediaType: MEDIA_JSON_MERGE,
			authRequired: true
		});

		this.addAction('get', (models, requestBody, requestMediaHandler, auth) => {
			// You can only view your own user page
			if (!auth || auth.id != models.id) {
				throw new ForbiddenError('You do not have permission to view this resource');
			}
		}, {
			authSchemes: { [ AUTH_BEARER ]: tokenResolver },
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('get') },
			defaultResponseMediaType: MEDIA_JSON,
			defaultRequestMediaType: MEDIA_JSON,
			authRequired: true
		});

		this.addAction('delete', (models, requestBody, requestMediaHandler, auth) => {
			// auth is valid if we get to this point, but I'm checking for auth here to protect against bugs
			// this would be a good dbConnection to check auth roles
			if (!auth || auth.id != models.id) {
				throw new ForbiddenError('You do not have permission to manipulate this resource');
			}

			models.active = 0;
			return models.save();
		}, {
			authSchemes: { [AUTH_BEARER]: tokenResolver },
			defaultResponseMediaType: MEDIA_JSON,
			responseMediaTypes: { [MEDIA_JSON]: new UserRepresentation('delete') },
			authRequired: true
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
				remoteId: urlParams.remote_id,
				active: 1
			});
		}

		throw new NotFoundError('User not found');
	}
}