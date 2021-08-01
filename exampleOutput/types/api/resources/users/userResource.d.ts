import { User } from './userModel';
import { ParsedURLParams, ActionList } from 'roads-api/types/Resource/resource';
import { Sequelize } from 'sequelize/types';
import UserRepresentation from './userRepresentation';
import { Logger } from '../../../logger';
import StarterResource, { TokenResolver } from '../../core/starterResource';
import { AuthFormat } from '../../core/tokenResolver';
import { APIConfig } from '../../server';
export default class UserResource extends StarterResource<UserRepresentation, User, AuthFormat> {
    constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver<AuthFormat>, config: APIConfig);
    modelsResolver(urlParams: ParsedURLParams | undefined, searchParams: URLSearchParams | undefined, action: keyof ActionList, pathname: string): Promise<User>;
}
