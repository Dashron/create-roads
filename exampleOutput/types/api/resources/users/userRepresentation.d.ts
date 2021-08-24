import { JSONRepresentation } from 'roads-api';
import { User } from './userModel';
import { AuthFormat } from '../../core/tokenResolver';
export interface UserFormat {
    id: number;
    createdTime: string;
    accessToken: string;
    refreshToken: string;
    remoteId: number;
    expiresIn: number;
    active: boolean;
}
export default class UserRepresentation extends JSONRepresentation<UserFormat, User, AuthFormat> {
    constructor(action: string);
}
