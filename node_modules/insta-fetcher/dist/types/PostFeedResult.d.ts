import { CommentInformTreatment, ImageVersions2, MusicMetadata, SharingFrictionInfo } from ".";
export interface PostFeedResult {
    media: Media;
    status: string;
}
export interface Media {
    taken_at: number;
    pk: string;
    id: string;
    device_timestamp: number;
    media_type: number;
    code: string;
    client_cache_key: string;
    filter_type: number;
    accessibility_caption: string;
    is_unified_video: boolean;
    user: IPostOwnerUser;
    can_viewer_reshare: boolean;
    caption_is_edited: boolean;
    like_and_view_counts_disabled: boolean;
    commerciality_status: string;
    is_paid_partnership: boolean;
    is_visual_reply_commenter_notice_enabled: boolean;
    original_media_has_visual_reply_media: boolean;
    comment_likes_enabled: boolean;
    comment_threading_enabled: boolean;
    has_more_comments: boolean;
    max_num_visible_preview_comments: number;
    preview_comments: any[];
    comments: any[];
    can_view_more_preview_comments: boolean;
    comment_count: number;
    hide_view_all_comment_entrypoint: boolean;
    image_versions2: ImageVersions2;
    original_width: number;
    original_height: number;
    photo_of_you: boolean;
    can_see_insights_as_brand: boolean;
    caption: null;
    fb_user_tags: FbUserTags;
    can_viewer_save: boolean;
    organic_tracking_token: string;
    sharing_friction_info: SharingFrictionInfo;
    comment_inform_treatment: CommentInformTreatment;
    product_type: string;
    is_in_profile_grid: boolean;
    profile_grid_control_enabled: boolean;
    deleted_reason: number;
    integrity_review_decision: string;
    music_metadata: MusicMetadata;
}
export interface FbUserTags {
    in: any[];
}
export interface IPostOwnerUser {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    has_anonymous_profile_picture: boolean;
    can_boost_post: boolean;
    can_see_organic_insights: boolean;
    show_insights_terms: boolean;
    reel_auto_archive: string;
    is_unpublished: boolean;
    allowed_commenter_type: string;
    has_highlight_reels: boolean;
    interop_messaging_user_fbid: string;
    fbid_v2: string;
}
