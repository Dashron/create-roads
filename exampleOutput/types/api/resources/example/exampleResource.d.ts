import { Sequelize } from 'sequelize/types';
import { Example } from './exampleModel';
import ExampleRepresentation from './exampleRepresentation';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { Logger } from '../../../logger';
import { APIConfig } from '../../api';
export default class ExampleResource extends StarterResource<ExampleRepresentation, Example, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig);
    modelsResolver(urlParams: {
        example_id: number;
    }): Promise<Example>;
}
