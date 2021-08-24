import ExampleResource from './exampleResource';
import ExampleListResource from './exampleListResource';
import { RegisterFn } from '../../api';
import registerExampleModel from './exampleModel';

export const register: RegisterFn = (router, connection, logger, tokenResolver, config) => {
	registerExampleModel(connection);
	router.addResource('/examples', new ExampleListResource(connection, logger, tokenResolver, config));
	router.addResource('/examples/{example_id}',
		new ExampleResource(connection, logger, tokenResolver, config), {
			urlParams: {
				schema: {
					example_id: {
						type: 'number'
					}
				},
				required: ['example_id']
			}
		});
};