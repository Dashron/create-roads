import * as jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize/types';
import { Logger } from '../../logger';
import { User } from '../resources/users/userModel';
import { APIConfig } from '../api';
import { TokenResolver } from './starterResource';

export type AuthFormat = User | false;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JWTTokenResolver extends TokenResolver<AuthFormat> {}

export default (sequelize: Sequelize, logger: Logger, config: APIConfig ): TokenResolver<AuthFormat> => {
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