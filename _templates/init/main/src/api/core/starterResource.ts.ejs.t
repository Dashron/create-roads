---
to: src/api/core/starterResource.ts
---
import { Resource } from 'roads-api';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { User } from '../resources/users/userModel';

export type TokenResolver = (token: string) => Promise<User>;
export type StarterResourceConfig = { [key: string]: unknown };

export type StarterResourceConstructor<RepresentationFormat, Models, Auth> = {
	new(dbConnection: Sequelize,
		logger: Logger,
		tokenResolver: TokenResolver,
		config: StarterResourceConfig): StarterResource<RepresentationFormat, Models, Auth>
}

export default abstract class StarterResource<RepresentationFormat, Models, Auth> extends
	Resource<RepresentationFormat, Models, Auth> {

	protected dbConnection: Sequelize
	protected logger: Logger;
	protected tokenResolver: TokenResolver;
	protected config: StarterResourceConfig;

	constructor(dbConnection: Sequelize, logger: Logger, tokenResolver: TokenResolver, config: StarterResourceConfig) {
		super();

		this.dbConnection = dbConnection;
		this.logger = logger;
		this.tokenResolver = tokenResolver;
		this.config = config;
	}
}