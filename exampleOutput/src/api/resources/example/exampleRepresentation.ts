import { JSONRepresentation } from 'roads-api';
import { Example } from './exampleModel';
import { AuthFormat } from '../../core/tokenResolver';

export interface ExampleFormat {
	id: number;
	name: string;
	ownerId: string;
	active: boolean;
}

export default class ExampleRepresentation extends JSONRepresentation<ExampleFormat, Example, AuthFormat> {
	constructor (action: string) {
		super();

		this.init({
			type: 'object',
			properties: {
				id: {
					type: 'number',
					roadsReadOnly: true,
					resolve: (models: Example) => {
						return models.id;
					}
				},
				name: {
					type: 'string',
					resolve: (models: Example) => {
						return models.name;
					},
					set: (models: Example, name: string) => {
						models.name = name;
					}
				},
				ownerId: {
					type: 'string',
					resolve: (models: Example) => {
						return models.ownerId;
					}
				},
				active: {
					type: 'boolean',
					resolve: (models: Example) => {
						return models.active == 1 ? true : false;
					},
					set: (models: Example, active: boolean) => {
						models.active = active ? 1 : 0;
					}
				}
			},
			required: action === 'append' ? ['name'] : [],
			additionalProperties: false
		});
	}
}