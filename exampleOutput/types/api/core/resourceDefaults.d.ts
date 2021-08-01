import { ActionConfig, AuthScheme } from 'roads-api/types/Resource/resource';
import { JSONRepresentation } from 'roads-api';
import { ResolveArrayItems } from 'roads-api/types/Representation/jsonRepresentation';
import { TokenResolver } from './starterResource';
interface JSONRepresentationConstructor<RepresentationFormat, Models, Auth> {
    new (action: string): JSONRepresentation<RepresentationFormat, Models, Auth>;
}
/**
 * GET REQUESTS
 */
export declare function getFn<RepresentationFormat, Models, Auth>(models: {
    ownerId: number;
}, requestBody: unknown, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: {
    id: number;
}): void;
export declare function getWithoutSoftFn<RepresentationFormat, Models, Auth>(models: {
    ownerId: number;
    active: number;
}, requestBody: unknown, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: {
    id: number;
}): void;
export declare function buildGetConfig<RepresentationFormat, Models, Auth>(tokenResolver: AuthScheme<Auth>, representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>): ActionConfig<Auth>;
export declare function buildGetListConfig<RepresentationFormat, Models, Auth>(tokenResolver: AuthScheme<Auth>, representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>, collectionItemsResolver: ResolveArrayItems): ActionConfig<Auth>;
export declare function partialEditFn<RepresentationFormat, Models, Auth>(models: Models & {
    save: () => any;
}, requestBody: RepresentationFormat, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth): Promise<unknown>;
export declare function buildPartialEditConfig<RepresentationFormat, Models, Auth>(tokenResolver: AuthScheme<Auth>, representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>): ActionConfig<Auth>;
export declare function appendFn<RepresentationFormat, Models, Auth>(models: Models & {
    ownerId: number;
    active: number;
    save: () => Promise<unknown>;
}, requestBody: RepresentationFormat, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth & {
    id: number;
}): Promise<unknown>;
export declare function appendFnNoActivation<RepresentationFormat, Models, Auth>(models: Models & {
    ownerId: number;
    save: () => Promise<unknown>;
}, requestBody: RepresentationFormat, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: Auth & {
    id: number;
}): Promise<unknown>;
export declare function buildAppendConfig<RepresentationFormat, Models, Auth>(tokenResolver: TokenResolver<Auth>, representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>): ActionConfig<Auth>;
export declare function softDeleteFn<RepresentationFormat, Models, Auth>(models: {
    ownerId: number;
    active: number;
    save: () => Promise<unknown>;
}, requestBody: unknown, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: {
    id: number;
}): Promise<unknown>;
export declare function hardDeleteFn<RepresentationFormat, Models, Auth>(models: {
    ownerId: number;
    destroy(options: {
        force: boolean;
    }): Promise<unknown>;
}, requestBody: unknown, requestMediaHandler: JSONRepresentation<RepresentationFormat, Models, Auth>, auth: {
    id: number;
}): Promise<unknown>;
export declare function buildDeleteConfig<RepresentationFormat, Models, Auth>(tokenResolver: AuthScheme<Auth>, representationConstructor: JSONRepresentationConstructor<RepresentationFormat, Models, Auth>): ActionConfig<Auth>;
export {};
