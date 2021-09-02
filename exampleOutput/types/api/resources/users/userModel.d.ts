import { Sequelize, Model, Optional } from 'sequelize';
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
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'accessToken' | 'refreshToken' | 'expiresIn' | 'role' | 'email' | 'source'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    accessToken: string;
    remoteId: string;
    refreshToken: string;
    expiresIn: number;
    active: number;
    role: string;
    email: string;
    source: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
declare const _default: (sequelize: Sequelize) => void;
export default _default;
