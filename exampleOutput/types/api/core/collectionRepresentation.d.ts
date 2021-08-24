import { JSONRepresentation } from "roads-api";
import { ResolveArrayItems } from "roads-api/types/Representation/jsonRepresentation";
export interface Collection<item> {
    data: Array<item>;
    perPage: number;
    page: number;
}
export default class CollectionRepresentation<RepresentationFormat, Model, Auth> extends JSONRepresentation<Collection<RepresentationFormat>, Model, Auth> {
    constructor(action: string, itemRepresentation: JSONRepresentation<RepresentationFormat, Model, Auth>, resolveArrayItems: ResolveArrayItems);
}
