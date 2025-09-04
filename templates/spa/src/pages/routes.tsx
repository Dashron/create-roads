import * as React from 'react';
import { Index, title as IndexPageTitle } from './components/index';
import { FirstPage, title as FirstPageTitle } from './components/firstPage';
import { SecondPage, title as SecondPageTitle } from './components/secondPage';
import { RouterMiddleware, Response } from 'roads';
import { StoreValsContext } from 'roads/types/middleware/storeVals';

export const addRoutes = (router: RouterMiddleware.Router<StoreValsContext>) => {
	router.addRoute('GET', '/', async function () {
		this.storeVal('title', IndexPageTitle);
		return new Response(<Index />);
	});

	router.addRoute('GET', 'firstpage', async function () {
		this.storeVal('title', FirstPageTitle);
		return new Response(<FirstPage />);
	});

	router.addRoute('GET', 'secondpage', async function () {
		this.storeVal('title', SecondPageTitle);
		return new Response(<SecondPage />);
	});
};
