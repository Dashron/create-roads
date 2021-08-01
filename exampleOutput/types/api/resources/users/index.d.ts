import { Router } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../../logger';
import { TokenResolver } from 'src/api/core/starterResource';
export declare function registerAPI(router: Router, connection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: any): void;
export declare function registerInit(connection: Sequelize): void;
