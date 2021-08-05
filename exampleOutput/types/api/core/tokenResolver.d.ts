import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { User } from '../resources/users/userModel';
import { APIConfig } from '../api';
import { TokenResolver } from './starterResource';
export declare type AuthFormat = User | false;
export interface JWTTokenResolver extends TokenResolver<AuthFormat> {
}
declare const _default: (sequelize: Sequelize, logger: Logger, config: APIConfig) => TokenResolver<AuthFormat>;
export default _default;
