---
to: src/api/core/tokenResolver.ts
---
import * as jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { User } from '../resources/users/userModel';
import { APIProjectConfig } from './apiProject';
import { TokenResolver } from './starterResource';

export type AuthFormat = User | false;

export default (sequelize: Sequelize, logger: Logger, config: APIProjectConfig ): TokenResolver<AuthFormat> => {
	return async function (token: string): Promise<AuthFormat> {
		try {
			const decoded = jwt.verify(token, config.secret, {
				algorithms: ['HS256']
			}) as { val: string };

			if (decoded && typeof decoded === 'object') {
				const user = await sequelize.models.User.findOne({
					where: {
						remoteId: decoded.val
					}
					// TODO: There's got to be a better way to do this
				}) as User;

				if (user) {
					return user;
				}
			}
		} catch (e) {
			return false;
		}

		return false;
	};
};