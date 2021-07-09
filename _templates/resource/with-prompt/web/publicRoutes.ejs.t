---
to: src/web/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>Routes/public<%= name %>Routes.ts
---

let { problemsToFormdata, valOrUndefined } = require('roads-starter/web/formValidation');
import SimpleRouter from 'roads/types/middleware/simpleRouter';
import { Logger } from 'roads-starter';
import templateLoader from '../templateLoader';
import * as fs from 'fs';

// TODO: Once template loader is part of roads-starter, these should all be moved into their routes, or server files
// We use this pattern so that brfs still loads the files
templateLoader.add('<%= firstLower %>ListIndex', () => templateLoader.compile(fs.readFileSync(__dirname + '/../../../templates/<%= firstLower %>/<%= firstLower %>Index.hbs').toString('utf-8')));
templateLoader.add('<%= firstLower %>List', () => templateLoader.compile(fs.readFileSync(__dirname + '/../../../templates/<%= firstLower %>/<%= firstLower %>List.hbs').toString('utf-8')));
templateLoader.add('<%= firstLower %>', () => templateLoader.compile(fs.readFileSync(__dirname + '/../../../templates/<%= firstLower %>/<%= firstLower %>Details.hbs').toString('utf-8')));
templateLoader.add('add<%= name %>', () => templateLoader.compile(fs.readFileSync(__dirname + '/../../../templates/<%= firstLower %>/add<%= name %>.hbs').toString('utf-8')));

export default function (router: SimpleRouter, config: object, logger: Logger) {
    router.addRoute('GET', '/<%= name.toLowerCase() %>', async function (path, body, headers) {
        if (!this.isLoggedIn()) {
            return this.requiresLoggedInResponse();
        }

        this.setTitle('Dungeon Dashboard: Your <%= name %>');
        let response = this.setNewCsrfToken();

        let <%= firstLower %>Response = await this.api('GET', '/<%= name.toLowerCase() %>');

        if (<%= firstLower %>Response.status !== 200) {
            logger.warn(<%= firstLower %>Response);
            return new this.Response('Unknown error when loading <%= name %> items', 500);
        }
        
        let <%= firstLower %>Items = JSON.parse(<%= firstLower %>Response.body);    

        let index = templateLoader.getTemplate('<%= firstLower %>ListIndex');
        let <%= firstLower %>List = templateLoader.getTemplate('<%= firstLower %>List');
        let add<%= name %>Form = templateLoader.getTemplate('add<%= name %>');

		response.body = index({
            <%= firstLower %>List: <%= firstLower %>List({
                <%= firstLower %>: <%= firstLower %>Items,
                loggedIn: this.isLoggedIn(),
                csrfToken: this.csrfToken
            }),
            add<%= name %>Element: this.isLoggedIn() ? add<%= name %>Form({
                csrfToken: this.csrfToken
            }) : '',
            loggedIn: this.isLoggedIn()
        });

        response.status = 200;
        response.headers['content-type'] = 'text/html';
        return response;
    });

    router.addRoute('GET', '/<%= name.toLowerCase() %>/#<%= firstLower %>_id', async function (path, body, headers) {
        if (!this.isLoggedIn()) {
            return this.requiresLoggedInResponse();
        }

        if (!path.args || !path.args.<%= firstLower %>_id) {
            return new this.Response('Page not found', 404);
        }
        let <%= firstLower %>Response = await this.api('GET', '/<%= name.toLowerCase() %>/' + path.args.<%= firstLower %>_id);

        if (<%= firstLower %>Response.status !== 200) {
            return new this.Response('Unknown error when loading <%= name %> items', 500);
        }
        
        let <%= firstLower %> = JSON.parse(<%= firstLower %>Response.body);    

        if (!this.isLoggedIn(<%= firstLower %>.ownerId)) {
            return this.requiresLoggedInResponse();
        }

        this.setTitle('Dungeon Dashboard: ' + <%= firstLower %>.name);

        let <%= firstLower %>Page = templateLoader.getTemplate('<%= firstLower %>');

        let response = this.setNewCsrfToken();
		response.body = <%= firstLower %>Page({
            <%= firstLower %>: <%= firstLower %>,
            csrfToken: this.csrfToken,
            loggedIn: this.isLoggedIn()
        });

        response.status = 200;
        response.headers['content-type'] = 'text/html';
        return response;
    });

    router.addRoute('POST', '/<%= name.toLowerCase() %>', async function (path, body, headers)  {
        if (!this.isLoggedIn()) {
            return this.requiresLoggedInResponse();
        }

        // todo: should this just  be automated middleware? if this.body.csrfToken: check?
        if (!this.checkCsrfToken(this.body.csrfToken)) {
            return new this.Response('Invalid Request', 400);
        }

        let requestBody = {
            name: valOrUndefined(this.body.name)
        };

        let appendResponse = await this.api('POST', '/<%= name.toLowerCase() %>', requestBody, {
            "content-type": "application/json"
        });
        
        let appendBody = JSON.parse(appendResponse.body);

        switch (appendResponse.status) {
            case 200:
            case 201:
                return new this.Response('', 302, {'location': '/<%= name.toLowerCase() %>'}); 
                break;
            case 400:
                let response = this.setNewCsrfToken();
                let add<%= name %>Form = templateLoader.getTemplate('add<%= name %>');
                
                response.body = add<%= name %>Form({
                    formData: problemsToFormdata(['/name'], requestBody, appendBody['additional-problems']),
                    csrfToken: this.csrfToken
                });

                logger.info({
                    requestBody: requestBody,
                    formData: problemsToFormdata(['/name'], requestBody, appendBody['additional-problems']),
                    csrfToken: this.csrfToken
                });

                response.status = 400;
                return response;
            default:
                // todo: make this an error when error no longer requires error objects
                logger.warn(appendResponse);
                return new this.Response('Unexpected Error', 500);
        }
    });

    router.addRoute('POST', '/<%= name.toLowerCase() %>/#<%= firstLower %>_id', async function (url, body, headers) {
        if (!this.isLoggedIn(/* todo: should this perform an up front auth check? */)) {
            return this.requiresLoggedInResponse();
        }

        if (!url.args || !url.args.<%= firstLower %>_id) {
            return new this.Response('Invalid Request', 400);
        }

        if (!this.checkCsrfToken(this.body.csrfToken)) {
            return new this.Response('Invalid Request', 400);
        }

        if (!this.body || this.body.methodOverride !== "DELETE") {
            return new this.Response('Invalid request', 400);
        }

        let deleteResponse = await this.api('DELETE', '/<%= name.toLowerCase() %>/' + url.args.<%= firstLower %>_id);

        if (deleteResponse.status !== 204) {
            return new this.Response('Unexpected Error', 500);
        }

        return new this.Response('', 302, {'location': '/<%= name.toLowerCase() %>'});
        
    });
};
