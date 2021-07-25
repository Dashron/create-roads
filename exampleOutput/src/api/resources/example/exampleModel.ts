import { Sequelize, Model, DataTypes as DataTypesModule } from 'sequelize';

export class Example extends Model {
	public id!: number;
	public name!: string;
	public ownerId!: number;
	public active!: number;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize, DataTypes: typeof DataTypesModule): void => {
	Example.init({
		id: {
			type:  DataTypes.INTEGER,
			primaryKey : true,
			autoIncrement : true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		active: {
			// todo: smaller
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'examples',
		sequelize: sequelize, // this bit is important
	});
};