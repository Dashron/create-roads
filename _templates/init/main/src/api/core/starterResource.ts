import { Resource } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { APIProjectConfig, TokenResolver } from './apiProject';

export type StarterResourceConstructor<RepresentationFormat, Models, Auth> = {
	new(dbConnection: Sequelize,
		logger: Logger,
		tokenResolver: TokenResolver,
		config: APIProjectConfig): StarterResource<RepresentationFormat, Models, Auth>
}

export default abstract class StarterResource<RepresentationFormat, Models, Auth> extends
	Resource<RepresentationFormat, Models, Auth> {

	protected dbConnection: Sequelize
	protected logger: Logger;
	protected tokenResolver: TokenResolver;
	protected config: APIProjectConfig;

	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: APIProjectConfig) {
		super();

		this.dbConnection = dbConnection;
		this.logger = logger;
		this.tokenResolver = tokenResolver;
		this.config = config;
	}
}