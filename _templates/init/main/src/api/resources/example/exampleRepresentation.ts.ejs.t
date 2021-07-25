---
to: src/api/resources/example/exampleRepresentation.ts
---
import { JSONRepresentation } from 'roads-api';
import { Example } from './exampleModel';

export default class ExampleRepresentation extends JSONRepresentation {
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