---
to: src/api/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>ListResource.ts
---

import { Sequelize } from "sequelize/types";

import { StarterResource, Logger } from "roads-starter";
import { APIProjectConfig, TokenResolver } from "roads-starter/types/api/apiProject";
import { ParsedURLParams, ActionList } from "roads-api/types/Resource/resource";

import { <%= name %>Model } from "./<%= firstLower %>Model";
import <%= name %>Representation from "./<%= firstLower %>Representation";
import { buildGetListConfig, appendFn, appendFnNoActivation, buildAppendConfig } from '../resourceDefaults';

export default class <%= name %>ListResource extends StarterResource {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig) {
        super(dbConnection, logger, tokenResolver, config);
        
        // TODO: Ensure we actually want these methods
        this.addAction('get', () => { return; }, buildGetListConfig(tokenResolver, <%= name %>Representation, (models: {items: Array<<%= name %>Model>}) => {
            return models.items;
        }));
        
        this.addAction("append", <% if (softDelete) { %>appendFn<% } else { %>appendFnNoActivation<% } %>, buildAppendConfig(tokenResolver, <%= name %>Representation));

        this.setSearchSchema({
            per_page: {
                type: "number"
            },
            page: {
                type: "number"
            }
        });
    }

    async modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string, auth: any) {
        if (action === 'append') {
            return <%= name %>Model.build();
        }

        let models: {
            items?: Array<<%= name %>Model>
            perPage: number,
            page: number
        } = {
            perPage: 10,
            page: 0
        };

        if (searchParams) {
            if (searchParams.has('per_page')) {
                models.perPage = Number(searchParams.get('per_page'));
            }

            if (searchParams.has('page')) {
                models.page = Number(searchParams.get('page'));
            }
        }

        models.items = await <%= name %>Model.findAll({
            limit: models.perPage,
            offset: models.perPage * models.page,
            where: {
                ownerId: auth.id<% if (softDelete) {%>,
                active: 1
                <% } %>
            },
            order: [['createdAt', 'DESC']]
        });
        
        return models;
    }
};