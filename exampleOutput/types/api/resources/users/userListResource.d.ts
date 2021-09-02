import { Sequelize } from 'sequelize/types';
import { User } from './userModel';
import { UserFormat } from './userRepresentation';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { Logger } from '../../../logger';
import { APIConfig } from '../../api';
import CollectionRepresentation from '../../core/collectionRepresentation';
import { ActionList, ParsedURLParams } from 'roads-api/types/Resource/resource';
declare type UserCollection = {
    users?: Array<User>;
};
interface UserCollectionRepresentation extends CollectionRepresentation<UserFormat, User, AuthFormat> {
}
export default class UserListResource extends StarterResource<UserCollectionRepresentation, User | UserCollection, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig);
    modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string, auth: AuthFormat): Promise<User | {
        users?: Array<User>;
    }>;
}
export {};
