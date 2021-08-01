import { JSONRepresentation } from 'roads-api';
import { Example } from './exampleModel';
import { AuthFormat } from '@api-core/tokenResolver';
export interface ExampleFormat {
    id: number;
    name: string;
    ownerId: string;
    active: boolean;
}
export default class ExampleRepresentation extends JSONRepresentation<ExampleFormat, Example, AuthFormat> {
    constructor(action: string);
}
