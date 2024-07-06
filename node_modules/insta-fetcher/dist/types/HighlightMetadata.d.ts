import { HighlightOwner } from "./HighlightMediaMetadata";
export interface ReelsIds {
    highlight_id: string;
    cover: string;
    title: string;
}
export interface HightlighGraphQL {
    data: IHighlightData;
    status: string;
}
export interface IHighlightData {
    viewer: null;
    user: IHighlightUser;
}
export interface IHighlightUser {
    has_public_story: boolean;
    edge_highlight_reels: Edge;
    edge_related_profiles: Edge;
}
export interface Edge {
    edges: EdgeElement[];
}
export interface EdgeElement {
    node: Node;
}
export interface Node {
    __typename: string;
    id: string;
    cover_media: CoverMedia;
    cover_media_cropped_thumbnail: CoverMediaCroppedThumbnail;
    owner: HighlightOwner;
    title: string;
}
export interface CoverMedia {
    thumbnail_src: string;
}
export interface CoverMediaCroppedThumbnail {
    url: string;
}
