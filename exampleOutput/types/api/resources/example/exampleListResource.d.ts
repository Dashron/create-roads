import { Sequelize } from 'sequelize/types';
import { Example } from './exampleModel';
import { ExampleFormat } from './exampleRepresentation';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { Logger } from '../../../logger';
import { APIConfig } from '../../api';
import CollectionRepresentation from '../../core/collectionRepresentation';
import { ActionList, ParsedURLParams } from 'roads-api/types/Resource/resource';
declare type ExampleCollection = {
    examples?: Array<Example>;
};
interface ExampleCollectionRepresentation extends CollectionRepresentation<ExampleFormat, Example, AuthFormat> {
}
export default class ExampleListResource extends StarterResource<ExampleCollectionRepresentation, Example | ExampleCollection, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig);
    modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string, auth: AuthFormat): Promise<Example | {
        examples?: Array<Example>;
    }>;
}
export {};
