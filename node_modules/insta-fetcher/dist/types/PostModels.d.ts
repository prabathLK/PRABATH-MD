import { Dimensions, SharingFrictionInfo } from '.';
export interface IPostModels {
    /** an Instagram Username */
    username: string;
    /** Instagram Full Name */
    name: string;
    /** Instagram Post type */
    postType: string;
    /** media id */
    media_id: string;
    /** post shortcode */
    shortcode: string;
    /** a timestamp of posted media */
    taken_at_timestamp: number;
    /** the number of user who like a instagram post */
    likes: number;
    /** an caption from instagram post */
    caption: string | null;
    /** total media */
    media_count: number;
    /** comment count */
    comment_count: number;
    /** if post is video */
    video_duration: number | null;
    /** music info will show if post is Reel */
    music?: ClipsMetadata | null;
    /** media urls */
    links: MediaUrls[];
}
export interface MediaUrls {
    /** Media ID */
    id: string;
    type: string;
    /** url of downloadable media */
    url: string;
    dimensions: Dimensions;
}
export interface IRawBody {
    items: Item[];
    num_results: number;
    more_available: boolean;
    auto_load_more_enabled: boolean;
}
export interface Item {
    taken_at: number;
    pk: number;
    id: string;
    device_timestamp: number;
    media_type: number;
    code: string;
    client_cache_key: string;
    filter_type: number;
    is_unified_video: boolean;
    user: User;
    can_viewer_reshare: boolean;
    caption_is_edited: boolean;
    like_and_view_counts_disabled: boolean;
    featured_products_cta: null;
    commerciality_status: string;
    is_paid_partnership: boolean;
    is_visual_reply_commenter_notice_enabled: boolean;
    original_media_has_visual_reply_media: boolean;
    comment_likes_enabled: boolean;
    comment_threading_enabled: boolean;
    has_more_comments: boolean;
    max_num_visible_preview_comments: number;
    carousel_media_count: number;
    carousel_media: CarouselMedia[];
    next_max_id: number;
    preview_comments: Comment[];
    comments: Comment[];
    can_view_more_preview_comments: boolean;
    comment_count: number;
    hide_view_all_comment_entrypoint: boolean;
    inline_composer_display_condition: string;
    image_versions2: ImageVersions2;
    original_width: number;
    original_height: number;
    like_count: number;
    has_liked: boolean;
    top_likers: any[];
    facepile_top_likers: any[];
    photo_of_you: boolean;
    can_see_insights_as_brand: boolean;
    mashup_info: MashupInfo;
    is_dash_eligible: number;
    video_dash_manifest: string;
    video_codec: string;
    number_of_qualities: number;
    video_versions: VideoVersion[];
    has_audio: boolean;
    video_duration: number;
    view_count: number;
    caption: Caption;
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
    clips_metadata: ClipsMetadata;
    media_cropping_info: MediaCroppingInfo;
    has_translation: boolean;
    caption_position: number;
    is_reel_media: boolean;
    expiring_at: number;
    can_reshare: boolean;
    can_reply: boolean;
    story_static_models: any[];
    supports_reel_reactions: boolean;
    can_send_custom_emojis: boolean;
    show_one_tap_fb_share_tooltip: boolean;
}
export interface Caption {
    pk: number;
    user_id: number;
    text: string;
    type: number;
    created_at: number;
    created_at_utc: number;
    content_type: string;
    status: string;
    bit_flags: number;
    did_report_as_spam: boolean;
    share_enabled: boolean;
    user: User;
    is_covered: boolean;
    media_id: number;
    private_reply_status: number;
}
export interface User {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    friendship_status: FriendshipStatus | false;
    is_verified: boolean;
    follow_friction_type: number;
    has_anonymous_profile_picture: boolean;
    is_unpublished: boolean;
    is_favorite: boolean;
    latest_reel_media: number;
    has_highlight_reels: boolean;
    live_broadcast_id: null;
    live_broadcast_visibility: null;
    can_boost_post: boolean;
    can_see_organic_insights: boolean;
    show_insights_terms: boolean;
    reel_auto_archive: string;
    allowed_commenter_type: string;
    interop_messaging_user_fbid: string;
    fbid_v2: string;
    account_badges: any[];
}
export interface FriendshipStatus {
    following: boolean;
    outgoing_request: boolean;
    is_bestie: boolean;
    is_restricted: boolean;
    is_feed_favorite: boolean;
    followed_by: boolean;
    blocking: boolean;
    muting: boolean;
    is_private: boolean;
    incoming_request: boolean;
}
export interface CarouselMedia {
    id: string;
    media_type: number;
    image_versions2: ImageVersions2;
    original_width: number;
    original_height: number;
    pk: number;
    carousel_parent_id: string;
    can_see_insights_as_brand: boolean;
    usertags?: Usertags;
    commerciality_status: string;
    sharing_friction_info: SharingFrictionInfo;
    comment_inform_treatment: CommentInformTreatment;
    video_versions?: VideoVersion[];
    video_duration?: number;
    is_dash_eligible?: number;
    video_dash_manifest?: string;
    video_codec?: string;
    number_of_qualities?: number;
}
export interface CommentInformTreatment {
    should_have_inform_treatment: boolean;
    text: string;
}
export interface ClipsMetadata {
    music_info: MusicInfo;
    original_sound_info: OriginalSoundInfo;
    audio_type: string;
    music_canonical_id: string;
    featured_label: null;
    mashup_info: MashupInfo;
    nux_info: null;
    viewer_interaction_settings: null;
    branded_content_tag_info: BrandedContentTagInfo;
    shopping_info: null;
    additional_audio_info: AdditionalAudioInfo;
    is_shared_to_fb: boolean;
    breaking_content_info: null;
    challenge_info: null;
    reels_on_the_rise_info: null;
    breaking_creator_info: null;
    asset_recommendation_info: null;
    contextual_highlight_info: null;
    clips_creation_entry_point: string;
    audio_ranking_info: AudioRankingInfo;
}
export interface AdditionalAudioInfo {
    additional_audio_username: null;
    audio_reattribution_info: AudioReattributionInfo;
}
export interface AudioReattributionInfo {
    should_allow_restore: boolean;
}
export interface AudioRankingInfo {
    best_audio_cluster_id: string;
}
export interface BrandedContentTagInfo {
    can_add_tag: boolean;
}
export interface MashupInfo {
    mashups_allowed: boolean;
    can_toggle_mashups_allowed: boolean;
    has_been_mashed_up: boolean;
    formatted_mashups_count: null;
    original_media: null;
    non_privacy_filtered_mashups_media_count: null;
}
export interface MusicInfo {
    music_asset_info: MusicAssetInfo;
    music_consumption_info: MusicConsumptionInfo;
    push_blocking_test: null;
}
export interface MusicAssetInfo {
    audio_cluster_id: string;
    id: string;
    title: string;
    subtitle: string;
    display_artist: string;
    artist_id: string;
    cover_artwork_uri: string;
    cover_artwork_thumbnail_uri: string;
    progressive_download_url: string;
    reactive_audio_download_url: null;
    fast_start_progressive_download_url: string;
    highlight_start_times_in_ms: number[];
    is_explicit: boolean;
    dash_manifest: null;
    has_lyrics: boolean;
    audio_asset_id: string;
    duration_in_ms: number;
    dark_message: null;
    allows_saving: boolean;
    territory_validity_periods: TerritoryValidityPeriods;
}
export interface TerritoryValidityPeriods {
}
export interface MusicConsumptionInfo {
    ig_artist: CoauthorProducer;
    placeholder_profile_pic_url: string;
    should_mute_audio: boolean;
    should_mute_audio_reason: string[];
    is_bookmarked: boolean;
    overlap_duration_in_ms: number;
    audio_asset_start_time_in_ms: number;
    allow_media_creation_with_music: boolean;
    is_trending_in_clips: boolean;
    formatted_clips_media_count: null;
    streaming_services: null;
    display_labels: null;
}
export interface CoauthorProducer {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id?: string;
    is_verified: boolean;
    follow_friction_type: number;
    friendship_status?: CoauthorProducerFriendshipStatus;
}
export interface CoauthorProducerFriendshipStatus {
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    muting: boolean;
    is_private: boolean;
    incoming_request: boolean;
    outgoing_request: boolean;
    is_bestie: boolean;
    is_restricted: boolean;
    is_feed_favorite: boolean;
}
export interface OriginalSoundInfo {
    audio_asset_id: number;
    progressive_download_url: string;
    dash_manifest: string;
    ig_artist: IgArtist;
    should_mute_audio: boolean;
    original_media_id: number;
    hide_remixing: boolean;
    duration_in_ms: number;
    time_created: number;
    original_audio_title: string[];
    consumption_info: ConsumptionInfo;
    allow_creator_to_rename: boolean;
    can_remix_be_shared_to_fb: boolean;
    formatted_clips_media_count: null;
    audio_parts: any[];
    is_explicit: boolean;
    original_audio_subtype: string;
    is_audio_automatically_attributed: boolean;
}
export interface ConsumptionInfo {
    is_bookmarked: boolean;
    should_mute_audio_reason: string;
    is_trending_in_clips: boolean;
}
export interface IgArtist {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    is_verified: boolean;
    follow_friction_type: number;
    friendship_status?: IgArtistFriendshipStatus;
}
export interface IgArtistFriendshipStatus {
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    muting: boolean;
    is_private: boolean;
    incoming_request: boolean;
    outgoing_request: boolean;
    is_bestie: boolean;
    is_restricted: boolean;
    is_feed_favorite: boolean;
}
export interface Usertags {
    in: In[];
}
export interface In {
    user: InUser;
    position: number[];
    start_time_in_video_in_sec: null;
    duration_in_video_in_sec: null;
}
export interface InUser {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    is_verified: boolean;
    follow_friction_type: number;
}
export interface VideoVersion {
    type: number;
    width: number;
    height: number;
    url: string;
    id: string;
}
export interface Location {
    pk: number;
    short_name: string;
    facebook_places_id: number;
    external_source: string;
    name: string;
    address: string;
    city: string;
    has_viewer_saved: boolean;
    lng: number;
    lat: number;
    is_eligible_for_guides: boolean;
}
export interface ImageVersions2 {
    candidates: FirstFrame[];
    additional_candidates: AdditionalCandidates;
    animated_thumbnail_spritesheet_info_candidates: AnimatedThumbnailSpritesheetInfoCandidates;
}
export interface AdditionalCandidates {
    igtv_first_frame: FirstFrame;
    first_frame: FirstFrame;
}
export interface FirstFrame {
    width: number;
    height: number;
    url: string;
}
export interface AnimatedThumbnailSpritesheetInfoCandidates {
    default: Default;
}
export interface Default {
    video_length: number;
    thumbnail_width: number;
    thumbnail_height: number;
    thumbnail_duration: number;
    sprite_urls: string[];
    thumbnails_per_row: number;
    total_thumbnail_num_per_sprite: number;
    max_thumbnails_per_sprite: number;
    sprite_width: number;
    sprite_height: number;
    rendered_width: number;
    file_size_kb: number;
}
export interface Candidate {
    width: number;
    height: number;
    url: string;
}
export interface MusicMetadata {
    music_canonical_id: string;
    audio_type: null;
    music_info: null;
    original_sound_info: null;
}
export interface MediaCroppingInfo {
    feed_preview_crop: null;
    square_crop: SquareCrop;
}
export interface SquareCrop {
    crop_bottom: number;
    crop_left: number;
    crop_right: number;
    crop_top: number;
}
export interface CommentInformTreatment {
    should_have_inform_treatment: boolean;
    text: string;
}
export interface Comment {
    pk: number;
    user_id: number;
    text: string;
    type: number;
    created_at: number;
    created_at_utc: number;
    content_type: string;
    status: string;
    bit_flags: number;
    did_report_as_spam: boolean;
    share_enabled: boolean;
    user: CommentUser;
    is_covered: boolean;
    media_id: number;
    has_liked_comment: boolean;
    comment_like_count: number;
    private_reply_status: number;
    parent_comment_id?: number;
}
export interface CommentUser {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    is_verified: boolean;
    follow_friction_type: number;
}
export interface ItemUser {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    friendship_status: FriendshipStatus;
    is_verified: boolean;
    follow_friction_type: number;
    has_anonymous_profile_picture: boolean;
    is_unpublished: boolean;
    is_favorite: boolean;
    latest_reel_media: number;
    has_highlight_reels: boolean;
    live_broadcast_id: null;
    live_broadcast_visibility: null;
}
export interface FriendshipStatus {
    following: boolean;
    outgoing_request: boolean;
    is_bestie: boolean;
    is_restricted: boolean;
    is_feed_favorite: boolean;
}
