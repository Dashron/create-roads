---
to: src/api/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>Resource.ts
---

import { Sequelize } from "sequelize/types";
import { HTTPErrors } from 'roads-api';
import { StarterResource, Logger } from 'roads-starter';
import { APIProjectConfig, TokenResolver } from "roads-starter/types/api/apiProject";

import { <%= name %>Model } from "./<%= firstLower %>Model";
import <%= name %>Representation from "./<%= firstLower %>Representation";

import { 
    getFn, buildGetConfig, 
    partialEditFn, buildPartialEditConfig,
    softDeleteFn, hardDeleteFn, buildDeleteConfig
} from '../resourceDefaults';

const { NotFoundError } = HTTPErrors;

export default class <%= name %>Resource extends StarterResource {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig) {
        super(dbConnection, logger, tokenResolver, config);
        // TODO: Ensure you want all these methods exposed
        this.addAction('get', getFn, buildGetConfig(tokenResolver, <%= name %>Representation));
        this.addAction("partialEdit", partialEditFn, buildPartialEditConfig(tokenResolver, <%= name %>Representation));
        this.addAction('delete', <% if (softDelete) { %>softDeleteFn<% } else { %>hardDeleteFn<% } %>, buildDeleteConfig(tokenResolver, <%= name %>Representation));
    }

    async modelsResolver(urlParams: { <%= name.toLowerCase() %>_id: number }) {
        let <%= name.toLowerCase() %> = await <%= name %>Model.findOne({
            where: {
                id: urlParams.<%= name.toLowerCase() %>_id
            }
        });
        
        if (<%= name.toLowerCase() %>) {
            return <%= name.toLowerCase() %>;
        }
        
        throw new NotFoundError("<%= name %> not found");
    }
};