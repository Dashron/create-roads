import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { User } from '../resources/users/userModel';
import { TokenResolver } from './starterResource';
export declare type AuthFormat = User | false;
declare const _default: (sequelize: Sequelize, logger: Logger, config: any) => TokenResolver<AuthFormat>;
export default _default;
