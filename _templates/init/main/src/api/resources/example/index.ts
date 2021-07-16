import exampleResource from './exampleResource';
import exampleListResource from './exampleListResource';
import APIProject from '../../core/apiProject';
import * as path from 'path';

export function registerAPI (apiProject: APIProject): void {
	apiProject.addModel(path.join(__dirname  , '/exampleModel'));

	apiProject.addResource('/examples', exampleListResource);
	apiProject.addResource('/examples/{example_id}', exampleResource, {
		urlParams: {
			schema: {
				example_id: {
					type: 'number'
				}
			},
			required: ['example_id']
		}
	});
}

export function registerInit (apiProject: APIProject): void {
	apiProject.addModel(path.join(__dirname  , '/exampleModel'));
}