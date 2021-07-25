import UserResource from './userResource';

import APIProject from '../../core/apiProject';
import * as path from 'path';

export function registerAPI (apiProject: APIProject): void {
	apiProject.addModel(path.join(__dirname, './users/userModel.js'));

	apiProject.addResource('/users/{remote_id}', UserResource, {
		urlParams: {
			schema: {
				remote_id: {
					type: 'string'
				}
			},
			required: ['remote_id']
		}
	});
}

export function registerInit (apiProject: APIProject): void {
	apiProject.addModel(path.join(__dirname, './users/userModel.js'));
}


