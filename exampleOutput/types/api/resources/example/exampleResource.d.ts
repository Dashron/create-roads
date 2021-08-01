import { Sequelize } from 'sequelize/types';
import { StarterResource, Logger } from 'roads-starter';
import { APIProjectConfig, TokenResolver } from 'roads-starter/types/api/apiProject';
import { Example } from './exampleModel';
export default class ExampleResource extends StarterResource {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig);
    modelsResolver(urlParams: {
        example_id: number;
    }): Promise<Example>;
}
