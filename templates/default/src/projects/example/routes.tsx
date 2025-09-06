/**
 * applyPrivateRoutes.ts
 * Copyright(c) 2018 Aaron Hedges <aaron@dashron.com>
 * MIT Licensed
 *
 * This file is an example of how to assign some private routes to a road server
 */

import * as React from 'react';

import { CookieMiddleware, StoreValsMiddleware, RouterMiddleware } from 'roads';
import { Home } from '../../projects/example/components/home.js';
import { JSONObjectResponse, ReactResponse } from '../../middleware/addLayout.js';
import * as staticRoutes from '../../projects/core/static.js';

const TITLE_KEY = 'page-title';

/**
  * Before calling this function you should create your roads object and bind a SimpleRouter to that road.
  * You then pass the road to this function to assign a collection of example routes that should only
  * be rendered on the server.
  *
  * @param {SimpleRouter} router - The router that the routes will be added to
  */
export function addRoutes(router: RouterMiddleware.Router<StoreValsMiddleware.StoreValsContext>): void {
	staticRoutes.register(router);

	router.addRoute('GET', '/', async function () {
		console.log('get root');
		return new ReactResponse(<Home />);
	});

	router.addRoute<CookieMiddleware.CookieContext>('GET', '/private', async function () {
		this.storeVal(TITLE_KEY, 'Private Resource');
		this.setCookie('private_cookie', 'foo', {
			httpOnly: true
		});

		this.setCookie('public_cookie', 'bar', {
			httpOnly: false
		});

		return new ReactResponse(<div>TODO: Fix this</div>);
	});

	router.addRoute('GET', '/privateJSON', async function () {
		this.storeVal('ignoreLayout', true);
		return new JSONObjectResponse({'private-success': true});
	});
}