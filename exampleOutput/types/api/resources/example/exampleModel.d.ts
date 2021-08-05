import { Sequelize, Model, Optional } from 'sequelize';
interface ExampleAttributes {
    id: number;
    name: string;
    ownerId: number;
    active: number;
}
interface ExampleCreationAttributes extends Optional<ExampleAttributes, 'id'> {
}
export declare class Example extends Model<ExampleAttributes, ExampleCreationAttributes> implements ExampleAttributes {
    id: number;
    name: string;
    ownerId: number;
    active: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
declare const _default: (sequelize: Sequelize) => void;
export default _default;
