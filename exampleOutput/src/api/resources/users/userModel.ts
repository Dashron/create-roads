import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface UserAttributes {
    id: number;
    accessToken: string;
    remoteId: string;
    refreshToken: string;
    expiresIn: number;
    active: number;
	role: string;
	email: string;
	source: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'accessToken' | 'refreshToken' | 'expiresIn' | 'role' | 'email' | 'source'> {}


export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes  {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public accessToken!: string;
    public remoteId!: string;
    public refreshToken!: string;
    public expiresIn!: number;
    public active!: number;
	public role!: string;
	public email!: string;
	public source!: string;

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
		},
		remoteId: {
			type: DataTypes.TEXT,
		},
		refreshToken: {
			type: DataTypes.TEXT,
		},
		expiresIn: {
			type: DataTypes.INTEGER,
		},
		active: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		role: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: 'user'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		source: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'users',
		sequelize: sequelize, // this bit is important
	});
};