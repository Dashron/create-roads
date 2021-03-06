---
to: src/api/resources/users/userRepresentation.ts
---
import { JSONRepresentation } from 'roads-api';
import moment from 'moment';
import { User } from './userModel';
import { AuthFormat } from '../../core/tokenResolver';

export interface UserFormat {
	id: number;
	createdTime: string;
	accessToken: string;
	refreshToken: string;
	remoteId: number;
	expiresIn: number;
	active: boolean;
}

export default class UserRepresentation extends JSONRepresentation<UserFormat, User, AuthFormat> {
	constructor (action: string) {
		super();

		this.init({
			type: 'object',
			properties: {
				id: {
					type: 'number',
					roadsReadOnly: true,
					resolve: (models: User) => {
						return models.id;
					}
				},
				createdTime: {
					type: 'string',
					resolve: (models: User) => {
						return models.createdAt;
					},
					format: 'iso8601date'
				},
				accessToken: {
					type: 'string',
					resolve: (models: User) => {
						return models.accessToken;
					},
					set: (models: User, accessToken: string, requestAuth: any) => {
						models.accessToken = accessToken;
					}
				},
				refreshToken: {
					type: 'string',
					resolve: (models: User) => {
						return models.refreshToken;
					},
					set: (models: User, refreshToken: string, requestAuth: any) => {
						models.refreshToken = refreshToken;
					}
				},
				remoteId: {
					type: 'string',
					resolve: (models: User) => {
						return models.remoteId;
					},
					set: (models: User, remoteId: string, requestAuth: any) => {
						models.remoteId = remoteId;
					}
				},
				expiresIn: {
					type: 'number',
					resolve: (models: User) => {
						return models.expiresIn;
					},
					set: (models: User, expiresIn: number, requestAuth: any) => {
						models.expiresIn = expiresIn;
					}
				},
				active: {
					type: 'boolean',
					resolve: (models: User) => {
						return models.active == 1 ? true : false;
					},
					set: (models: User, active: boolean, requestAuth: any) => {
						models.active = active ? 1 : 0;
					}
				}
			},
			additionalProperties: false,
			required: []
		}, {
			formats: {
				iso8601date: (value: string) => {
					try {
						moment(value);
						return true;
					} catch (e) {
						return false;
					}
				}
			}
		});
	}
}