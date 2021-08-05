// TODO: Merge this with starter resource?
import { ActionConfig, AuthScheme } from 'roads-api/types/Resource/resource';
import { JSONRepresentation } from 'roads-api';
import { HTTPErrors, CONSTANTS } from 'roads-api';
import CollectionRepresentation from './collectionRepresentation';
import { ResolveArrayItems } from 'roads-api/types/Representation/jsonRepresentation';
import { TokenResolver } from './starterResource';
const { NotFoundError } = HTTPErrors;
const { MEDIA_JSON, MEDIA_JSON_MERGE, AUTH_BEARER } = CONSTANTS;

interface JSONRepresentationConstructor<RepresentationFormat, Models, Auth> {
	new(action: string): JSONRepresentation<RepresentationFormat, Models, Auth>
}

/**
 * GET REQUESTS
 */
export function getFn<RepresentationFormat, Models, Auth> (models: {
	ownerId: number
}, requestBody: unknown,
requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth & { id: number }): void  {
	if (!auth || (models.ownerId != auth.id)) {
		// TODO: this resource name should be configurable
		throw new NotFoundError('Resource Not Found: Auth required');
	}
}

export function getWithoutSoftFn<RepresentationFormat, Models, Auth> (models: {
	ownerId: number,
	active: number
}, requestBody: unknown,
requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth & { id: number }): void {
	if (!auth || (models.ownerId != auth.id) || models.active !== 1) {
		// TODO: this resource name should be configurable
		throw new NotFoundError('Resource Not Found: Auth required');
	}
}

export function buildGetConfig<RepresentationFormat, Models, Auth> (
	tokenResolver: AuthScheme<Auth>,
	representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>
): ActionConfig {

	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		responseMediaTypes: { [MEDIA_JSON]: new representationConstructor('get') },
		defaultResponseMediaType: MEDIA_JSON,
		defaultRequestMediaType: MEDIA_JSON,
		authRequired: false
	};
}

export function buildGetListConfig<RepresentationFormat, Models, Auth> (
	tokenResolver: AuthScheme<Auth>,
	representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>,
	collectionItemsResolver: ResolveArrayItems
): ActionConfig {

	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		responseMediaTypes: {
			[MEDIA_JSON]: new CollectionRepresentation<RepresentationFormat, Models, Auth>('get',
				new representationConstructor('get'), collectionItemsResolver)
		},
		authRequired: true,
		defaultRequestMediaType: MEDIA_JSON,
		defaultResponseMediaType: MEDIA_JSON
	};
}

/*
 * PARTIAL EDIT REQUESTS
 */
export async function partialEditFn<RepresentationFormat, Models, Auth> (
	// I don't think this is the right way to define this. TODO
	models: Models & { save: () => any },
	requestBody: RepresentationFormat,
	requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth
): Promise<unknown> {
	if (auth) {
		requestMediaHandler.applyEdit(requestBody, models, auth);
		return models.save();
	}
}

export function buildPartialEditConfig<RepresentationFormat, Models, Auth> (
	tokenResolver: AuthScheme<Auth>,
	representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>
): ActionConfig {

	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		requestMediaTypes: { [MEDIA_JSON_MERGE]: new representationConstructor('partialEdit') },
		defaultRequestMediaType: MEDIA_JSON_MERGE,
		authRequired: true,
		responseMediaTypes: { [MEDIA_JSON]: new representationConstructor('partialEdit') },
		defaultResponseMediaType: MEDIA_JSON
	};
}

/*
 * FULL REPLACE
 */
/*export let fullReplaceFn = (models: any, requestBody: any, requestMediaHandler: JSONRepresentation, auth: any) => {
	if (auth) {
		requestMediaHandler.applyEdit(requestBody, models, auth);
		return models.save();
	}
};

export function buildFullReplaceConfig(tokenResolver: TokenResolver,
	representationConstructor: JSONRepresentationConstructor): ActionConfig {
	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		requestMediaTypes: { [MEDIA_JSON]: new representationConstructor("fullReplace") },
		responseMediaTypes: { [MEDIA_JSON]: new representationConstructor("fullReplace") },
		defaultRequestMediaType: MEDIA_JSON,
		defaultResponseMediaType: MEDIA_JSON,
		authRequired: false
	};
}*/

/*
 * APPEND
 *
 * TODO: How do we get this working with the list resource
 */
export async function appendFn<RepresentationFormat, Models, Auth> (
	models: Models & {
		ownerId: number,
		active: number,
		save: () => Promise<unknown>
	}, requestBody: RepresentationFormat,
	requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>,
	auth: Auth & { id: number }
): Promise<unknown> {

	await requestMediaHandler.applyEdit(requestBody, models, auth);
	models.ownerId = auth.id;
	models.active = 1;
	return models.save();
}

export async function appendFnNoActivation<RepresentationFormat, Models, Auth> (
	models: Models & {
		ownerId: number,
		save: () => Promise<unknown>
	},
	requestBody: RepresentationFormat,
	requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>,
	auth: Auth & { id : number }
): Promise<unknown> {

	await requestMediaHandler.applyEdit(requestBody, models, auth);
	models.ownerId = auth.id;
	return models.save();
}

export function buildAppendConfig<RepresentationFormat, Models, Auth> (
	tokenResolver: TokenResolver<Auth>,
	representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>
): ActionConfig {

	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		requestMediaTypes: { [MEDIA_JSON]: new representationConstructor('append') },
		responseMediaTypes: { [MEDIA_JSON]: new representationConstructor('append') },
		defaultRequestMediaType: MEDIA_JSON,
		defaultResponseMediaType: MEDIA_JSON,
		authRequired: true
	};
}


/*
 * DELETE
 */
export async function softDeleteFn<RepresentationFormat, Models, Auth> (
	models: {
		ownerId: number,
		active: number,
		save: () => Promise<unknown>
	},
	requestBody: unknown,
	requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>,
	auth: Auth & { id: number } ): Promise<unknown> {

	if (models.ownerId == auth.id) {
		models.active = 0;
		return models.save();
	}
}

export async function hardDeleteFn<RepresentationFormat, Models, Auth> (
	models: {
		ownerId: number,
		destroy(options: {force: boolean}): Promise<unknown>
	},
	requestBody: unknown,
	requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>,
	auth: { id: number }
): Promise<unknown> {

	if (models.ownerId == auth.id) {
		return models.destroy({force: true});
	}
}

export function buildDeleteConfig<RepresentationFormat, Models, Auth>(
	tokenResolver: AuthScheme<Auth>,
	representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>
): ActionConfig {

	return {
		authSchemes: { [AUTH_BEARER]: tokenResolver },
		authRequired: true,
		responseMediaTypes: { [MEDIA_JSON]: new representationConstructor('delete') },
		defaultResponseMediaType: MEDIA_JSON,
		defaultRequestMediaType: MEDIA_JSON
	};
}