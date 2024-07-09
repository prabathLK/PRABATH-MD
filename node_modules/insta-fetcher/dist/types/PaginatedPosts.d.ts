import { PageInfo, PurpleNode } from "./PostMetadata";
export interface IPaginatedPosts {
    count: number;
    page_info: PageInfo;
    edges: EdgeOwnerToTimelineMediaEdge[];
}
export interface EdgeOwnerToTimelineMediaEdge {
    node: PurpleNode;
}
