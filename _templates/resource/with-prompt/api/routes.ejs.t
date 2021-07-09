---
to: src/api/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>Routes.ts
---

import <%= firstLower %>Resource from './<%= firstLower %>Resource';
import <%= firstLower %>ListResource from './<%= firstLower %>ListResource';
import { APIProject } from 'roads-starter';

// TODO: FOR THIS TO WORK, I NEED SERVER.TS TO READ THIS FILE
export function registerAPI (apiProject: APIProject) {
    apiProject.addModel(__dirname + '/<%= firstLower %>Model');

    apiProject.addResource('/<%= name.toLowerCase() %>', <%= firstLower %>ListResource);
    // TODO: Ensure this url is correct
    apiProject.addResource('/<%= name.toLowerCase() %>/{<%= name.toLowerCase() %>_id}', <%= firstLower %>Resource, {
        // TODO: Ensure these parameters are correct
        urlParams: {
            schema: {
                <%= name.toLowerCase() %>_id: {
                    type: "number"
                }
            },
            required: ['<%= name.toLowerCase() %>_id']
        }
    });
}

// TODO: FOR THIS TO WORK, I NEED INIT.TS TO READ THIS FILE
export function registerInit (apiProject: APIProject) {
    apiProject.addModel(__dirname + '/<%= firstLower %>Model');
}