import { Sequelize } from 'sequelize/types';
import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';
import StarterResource from '@api-core/starterResource';
import { AuthFormat, JWTTokenResolver } from '@api-core/tokenResolver';
import { Logger } from '@src/logger';
import { APIConfig } from '@src/api/api';
export default class ExampleResource extends StarterResource<ExampleRepresentation, Example, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig);
    modelsResolver(urlParams: {
        example_id: number;
    }): Promise<Example>;
}
