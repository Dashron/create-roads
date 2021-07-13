---
to: src/web/middleware/addLayout.ts
---
/**
 * addLayout.ts
 * Copyright(c) 2021 Aaron Hedges <aaron@dashron.com>
 * MIT Licensed
 *
 * This file exposes a middleware function that wraps any return HTML in a standard layout
 */

import { Middleware } from 'roads/types/core/road';
import { Response } from 'roads';
const TITLE_KEY = 'page-title';
import { StoreValsContext } from 'roads/types/middleware/storeVals';

export type LayoutWrapper = (body: string, title: string, context: Context) => string;

export default function (layoutWrapper: LayoutWrapper): Middleware {
	/**
	* This middleware wraps the response in a standard HTML layout. It looks for three fields in the request context.
	* - _page_title - The title of the page
	* - ignore_layout - If true, this middleware will not apply the layout (useful for JSON responses)
	*
	* @param {string} method - HTTP request method
	* @param {string} url - HTTP request url
	* @param {string} body - HTTP request body
	* @param {object} headers - HTTP request headers
	* @param {function} next - When called, this function will execute the next step in the roads method chain
	*/
	return function (method, url, body, headers, next) {
		return next()
			.then((response) => {
				if (!(response instanceof Response)) {
					response = new Response(response);
				}

				let layoutData = {};

				if (this.getAllVals) {
					layoutData = this.getAllVals();
				}

				response.body = wrapLayout(response.body, layoutData);
				return response;
			});
	};
}