import { Sequelize, Model, DataTypes as DataTypesModule } from 'sequelize';
export declare class Example extends Model {
    id: number;
    name: string;
    ownerId: number;
    active: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
declare const _default: (sequelize: Sequelize, DataTypes: typeof DataTypesModule) => void;
export default _default;
