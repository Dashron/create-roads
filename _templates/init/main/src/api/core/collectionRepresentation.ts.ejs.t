---
to: src/api/core/collectionRepresentation.ts
---
import JSONRepresentation, { ResolveArrayItems } from 'roads-api/types/Representation/jsonRepresentation';

export interface Collection<item> {
	data: Array<item>,
	perPage: number,
	page: number
}

export default class CollectionRepresentation<RepresentationFormat, Model, Auth> extends
	JSONRepresentation<Collection<RepresentationFormat>, Model, Auth> {

	constructor (
		action: string,
		itemRepresentation: JSONRepresentation<RepresentationFormat, Model, Auth>,
		resolveArrayItems: ResolveArrayItems) {

		super();

		this.init({
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: itemRepresentation.getSchema(),
					representation: itemRepresentation,
					resolveArrayItems: resolveArrayItems
				},
				perPage: {
					type: 'number',
					resolve: (models: {perPage: number}) => {
						return models.perPage;
					}
				},
				page: {
					type: 'number',
					resolve: (models: {page: number}) => {
						return models.page;
					}
				}
			},
			additionalProperties: false,
			required: []
		// :( this needs to be removed. see the collection on roads-api for details on how
		} as any);
	}
}