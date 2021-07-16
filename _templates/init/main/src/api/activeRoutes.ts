import APIProject from './core/apiProject';
import * as exampleAPI from './resources/example/index';

// TODO: This should be an array of resources, which automatically scan and register the relevant files.
export function registerRoutes (api: APIProject): void {
	exampleAPI.registerAPI(api);
}

export function registerInit (api: APIProject): void {
	exampleAPI.registerInit(api);
}