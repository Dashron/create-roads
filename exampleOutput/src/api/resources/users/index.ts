import UserResource from './userResource';
import registerUserModel from './userModel';
import { RegisterFn } from '@root/api/api';

export const register: RegisterFn = (router, connection, logger, tokenResolver, config) => {

	registerUserModel(connection);

	router.addResource('/users/{remote_id}',
		new UserResource(connection, logger, tokenResolver, config), {
			urlParams: {
				schema: {
					remote_id: {
						type: 'string'
					}
				},
				required: ['remote_id']
			}
		});
};