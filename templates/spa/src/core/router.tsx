import * as React from 'react';

import { createRoot, Root } from 'react-dom/client';
import { Road, RoadsPJAX, RouterMiddleware, CookieMiddleware, attachCommonMiddleware } from 'roads';
import { addRoutes } from '../pages/routes';

import { NotFoundComponent } from '../pages/components/notFound';

let root: Root;
let road: Road;

/**
 * Move the page to a new URL, and render the content for that page.
 */
export async function navigate(urlPath: string) {
	const content = document.getElementById("content");

	if (!content) { 
		throw new Error('Content element not found');
	}

	window.history.pushState({},"", urlPath);
	renderPath(window.location.pathname);
}

/**
 * 
 */
export function init() {
	road = new Road();
	const content = document.getElementById("content");

	if (!content) { 
		throw new Error('Content element not found');
	}

	root = createRoot(content);

	road.use(function (method, url, body, headers, next) {
		console.log(`fake ${  method  } request to...`, url);
		return next();
	});
	
	attachCommonMiddleware(road);
	road.use(CookieMiddleware.buildClientMiddleware(document));
	const router = new RouterMiddleware.Router(road);
	addRoutes(router);

	/**
	 * Handle the back button
	 */
	window.addEventListener("popstate", (e) => {
		renderPath(window.location.pathname);
	});
}

/**
 * 
 * @param path 
 * @returns 
 */
export async function renderPath(path: string) {
	return road.request('GET', path).then((response) => {
		if (response.status === 404) {
			window.location.href = '/404';
			return;
		}

		root.render(response.body);
	});
}