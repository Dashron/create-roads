---
to: src/api/core/activeRoutes.ts
---
import APIProject from './core/apiProject';
import * as exampleAPI from './resources/example/index';
import * as usersAPI from './resources/users/index';

const enabledResources = [
	exampleAPI,
	usersAPI
];

export function registerRoutes (api: APIProject): void {
	enabledResources.forEach(resource => {
		resource.registerAPI(api);
	});
}

export function registerInit (api: APIProject): void {
	enabledResources.forEach(resource => {
		resource.registerInit(api);
	});
}