import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface ExampleAttributes {
	id: number;
	name: string;
	ownerId: number;
	active: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExampleCreationAttributes extends Optional<ExampleAttributes, 'id'> {}


export class Example extends Model<ExampleAttributes, ExampleCreationAttributes> implements ExampleAttributes {
	public id!: number;
	public name!: string;
	public ownerId!: number;
	public active!: number;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): void => {
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