import * as jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { APIProjectConfig, TokenResolver } from './apiProject';

export default (sequelize: Sequelize, logger: Logger, config: APIProjectConfig ): TokenResolver => {
	return async function (token: string): Promise<unknown> {
		try {
			const decoded = jwt.verify(token, config.secret, {
				algorithms: ['HS256']
			}) as { val: string };

			if (decoded && typeof decoded === 'object') {
				const user = await sequelize.models.User.findOne({
					where: {
						remoteId: decoded.val
					}
				});

				if (user) {
					return user;
				}

				return false;
			}
		} catch (e) {
			return false;
		}
	};
};