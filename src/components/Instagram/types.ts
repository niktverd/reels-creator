export interface MediaItem {
    id: string;
    media_url?: string;
    thumbnail_url?: string;
    caption?: string;
    media_type?: string;
    likes?: number;
    like_count?: number;
    comments_count?: number;
    reach?: number;
    favorite?: boolean;
    timestamp?: string;
}

export interface InstagramProfile {
    id?: string;
    username?: string;
    profile_picture?: string;
    full_name?: string;
}

export interface InstagramUser {
    username: string;
    biography: string;
    followers_count: number;
    follows_count: number;
    media_count: number;
    profile_picture_url: string;
    website: string;
}

export interface Paging {
    cursors?: {
        before?: string;
        after?: string;
    };
    next?: string;
    previous?: string;
}

export interface InstagramContent {
    account: string;
    ig_user_id: string;
    user_info: InstagramUser;
    media: MediaItem[];
    paging: Paging;
}
