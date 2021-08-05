import { User } from './userModel';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';
import { Sequelize } from 'sequelize/types';
import UserRepresentation from './userRepresentation';
import { Logger } from '../../../logger';
import StarterResource from '../../core/starterResource';
import { AuthFormat, JWTTokenResolver } from '../../core/tokenResolver';
import { APIConfig } from '../../api';
export default class UserResource extends StarterResource<UserRepresentation, User, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: JWTTokenResolver, config: APIConfig);
    modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string): Promise<User>;
}
