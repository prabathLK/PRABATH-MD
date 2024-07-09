export interface IGUserMetadata {
    /** Instagram user id */
    id: number;
    /** Instagram username */
    username: string;
    /** full name of instagram account */
    fullname: string;
    /** followers count */
    followers: number;
    /** following count */
    following: number;
    /** total post */
    post_count: number;
    /** is_private? */
    is_private: boolean;
    is_verified: boolean;
    /** full instagram bio */
    biography: string;
    /** external url given by user */
    external_url: string;
    /** total of an IGTV videos if has igtv post */
    total_igtv_videos: number;
    has_videos: boolean;
    /** url of instagram profile picture at HD / Original Quality */
    hd_profile_pic_url_info: HDProfilePic;
    has_highlight_reels: boolean;
    has_guides: boolean;
    is_business: boolean;
    /** contact phone number if user set their phone number to public */
    contact_phone_number: string;
    /** contact email  */
    public_email: string;
    /** account type e.g Business | Personal .etc */
    account_type: number;
}
export interface UserGraphQL {
    user: UserDetails;
    status: string;
}
export interface UserDetails {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    is_verified: boolean;
    follow_friction_type: number;
    has_anonymous_profile_picture: boolean;
    media_count: number;
    geo_media_count: number;
    follower_count: number;
    following_count: number;
    following_tag_count: number;
    biography: string;
    external_url: string;
    external_lynx_url: string;
    show_fb_link_on_profile: boolean;
    primary_profile_link_type: number;
    has_biography_translation: boolean;
    total_igtv_videos: number;
    has_videos: boolean;
    total_ar_effects: number;
    usertags_count: number;
    is_favorite: boolean;
    is_interest_account: boolean;
    has_chaining: boolean;
    hd_profile_pic_versions: HDProfilePic[];
    hd_profile_pic_url_info: HDProfilePic;
    mutual_followers_count: number;
    profile_context: string;
    profile_context_links_with_user_ids: ProfileContextLinksWithUserID[];
    profile_context_mutual_follow_ids: number[];
    has_highlight_reels: boolean;
    has_guides: boolean;
    can_be_reported_as_fraud: boolean;
    is_eligible_for_smb_support_flow: boolean;
    smb_support_partner: null;
    direct_messaging: string;
    address_street: string;
    business_contact_method: string;
    category: string;
    city_id: number;
    city_name: string;
    contact_phone_number: string;
    is_call_to_action_enabled: boolean;
    latitude: number;
    longitude: number;
    public_email: string;
    public_phone_country_code: string;
    public_phone_number: string;
    zip: string;
    instagram_location_id: string;
    is_business: boolean;
    professional_conversion_suggested_account_type: number;
    account_type: number;
    can_hide_category: boolean;
    can_hide_public_contacts: boolean;
    should_show_category: boolean;
    should_show_public_contacts: boolean;
    interop_messaging_user_fbid: number;
    account_badges: any[];
    include_direct_blacklist_status: boolean;
    is_potential_business: boolean;
    show_post_insights_entry_point: boolean;
    request_contact_enabled: boolean;
    is_bestie: boolean;
    has_unseen_besties_media: boolean;
    show_account_transparency_details: boolean;
    auto_expand_chaining: boolean;
    highlight_reshare_disabled: boolean;
    is_memorialized: boolean;
    open_external_url_with_in_app_browser: boolean;
}
export interface HDProfilePic {
    width: number;
    height: number;
    url: string;
}
export interface ProfileContextLinksWithUserID {
    start: number;
    end: number;
    username: string;
}
