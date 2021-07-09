---
to: src/api/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>Representation.ts
---

import { JSONRepresentation } from 'roads-api';
import { <%= name %>Model } from './<%= firstLower %>Model';

export default class <%= name %>Representation extends JSONRepresentation {
    constructor (action: string) {
        super();

        this.init({
            // TODO: Add any relevant JSON Representation fields
            "type": "object",
            "properties": {
                "id": {
                    "type": "number",
                    "roadsReadOnly": true,
                    "resolve": (models: <%= name %>Model) => {
                        return models.id;
                    }
                },
                "ownerId": {
                    "type": "string",
                    "resolve": (models: <%= name %>Model) => {
                        return models.ownerId;
                    }
                },
            },
            "required": action === "append" ? [] : [],
            "additionalProperties": false
        });
    }
};