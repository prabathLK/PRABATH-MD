import { IgCookie } from ".";
export interface LoginData {
    cookie: IgCookie;
    logged_in_user: LoggedInUser;
    session_flush_nonce: any;
    status: string;
}
export interface LoggedInUser {
    pk: number;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_id: string;
    is_verified: boolean;
    follow_friction_type: number;
    growth_friction_info: GrowthFrictionInfo;
    has_anonymous_profile_picture: boolean;
    is_supervision_features_enabled: boolean;
    can_boost_post: boolean;
    is_business: boolean;
    account_type: number;
    professional_conversion_suggested_account_type: number;
    is_call_to_action_enabled: boolean;
    can_see_organic_insights: boolean;
    show_insights_terms: boolean;
    total_igtv_videos: number;
    has_igtv_series: boolean;
    reel_auto_archive: string;
    has_placed_orders: boolean;
    allowed_commenter_type: string;
    has_highlight_reels: boolean;
    nametag: Nametag;
    can_hide_category: boolean;
    can_hide_public_contacts: boolean;
    should_show_category: boolean;
    category: string;
    should_show_public_contacts: boolean;
    is_using_unified_inbox_for_direct: boolean;
    biz_user_inbox_state: number;
    wa_addressable: boolean;
    wa_eligibility: number;
    interop_messaging_user_fbid: number;
    can_see_primary_country_in_settings: boolean;
    account_badges: any[];
    fbid_v2: number;
    all_media_count: number;
    allow_contacts_sync: boolean;
    phone_number: string;
    country_code: number;
    national_number: number;
}
export interface GrowthFrictionInfo {
    has_active_interventions: boolean;
    interventions: Interventions;
}
export interface Interventions {
}
export interface Nametag {
    mode: number;
    gradient: number;
    emoji: string;
    selfie_sticker: number;
}
