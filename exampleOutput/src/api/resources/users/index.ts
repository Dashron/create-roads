import UserResource from './userResource';
import UserListResource from './userListResource';
import registerUserModel from './userModel';
import { RegisterFn } from '../../api';

export const register: RegisterFn = (router, connection, logger, tokenResolver, config) => {

	registerUserModel(connection);

	router.addResource('/users', new UserListResource(connection, logger, tokenResolver, config));

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