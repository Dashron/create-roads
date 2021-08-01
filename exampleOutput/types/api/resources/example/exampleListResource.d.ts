import { Sequelize } from 'sequelize/types';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';
import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';
import StarterResource, { TokenResolver } from '@api-core/starterResource';
import { AuthFormat } from '@api-core/tokenResolver';
import { Logger } from '@root/logger';
import { APIConfig } from '@root/api/server';
export default class ExampleListResource extends StarterResource<ExampleRepresentation, Example, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver<AuthFormat>, config: APIConfig);
    modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string, auth: AuthFormat): Promise<Example | {
        examples?: Array<Example>;
    }>;
}
