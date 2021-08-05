import { Sequelize, Model, Optional } from 'sequelize';
interface UserAttributes {
    id: number;
    accessToken: string;
    remoteId: string;
    refreshToken: string;
    expiresIn: number;
    active: number;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'accessToken' | 'refreshToken' | 'expiresIn'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    accessToken: string;
    remoteId: string;
    refreshToken: string;
    expiresIn: number;
    active: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
declare const _default: (sequelize: Sequelize) => void;
export default _default;
