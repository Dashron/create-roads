---
to: src/api/resources/users/userModel.ts
---
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface UserAttributes {
    id: number;
    accessToken: string;
    remoteId: string;
    refreshToken: string;
    expiresIn: number;
    active: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}


export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes  {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public accessToken!: string;
    public remoteId!: string;
    public refreshToken!: string;
    public expiresIn!: number;
    public active!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): void => {
	// Example TS models: https://sequelize.org/master/manual/typescript.html
	User.init({
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey : true,
			autoIncrement : true
		},
		accessToken: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		remoteId: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		refreshToken: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		expiresIn: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		active: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		}
	}, {
		tableName: 'users',
		sequelize: sequelize, // this bit is important
	});
};