import { Comment } from 'models/classes';
import { Status } from 'models/Types';
import { Account, Manager, SocialChannel } from '.';

/**
 * Represents an influencer data model
 * for a campaign
 */
export interface Influencer {
    _id: string;
    budget?: string;
    comments: Comment[];
    creatives?: any[];
    email?: string;
    hashtags: string[];
    influencer?: Account;
    invitation_token?: string;
    manager?: Manager;
    mentions: string[];
    n_posts: number;
    n_stories: number;
    n_videos: number;
    name?: string;
    posts: any[];
    requirements: string;
    special_notes: string;
    status: Status;
    stories: any[];
    vision: string;
    // attachments: any[]
    // files?: any[]
}

/**
 * Represents the data model for the influencer
 * on their profile page with all demographics etc
 */
export interface InfluencerProfile extends Account {
    // _id: string
    about: string;
    categories: string[]; // todo change to categories
    channels: SocialChannel[];
    // email: string
    gender: string;
    instagram_age: any;
    instagram_cities: any;
    instagram_collaborations: Collaboration[];
    instagram_engagement_rate: number;
    instagram_followers: Followers;
    instagram_hashtags: Hashtag[];
    instagram_mentions: Mention[];
    is_approved: boolean;
    instagram_monthly_engagement: any;
    instagram_total_followers: number;
    country: string;
    city: string;
    // name: string
    // post_price: number
    phone_number: string;
    posts_per_day: any;
    // profile_picture: string
    // role: ROLE
    // story_price: number
    topics: string[];
    // video_price: number
}

interface Hashtag {
    count: number;
    name: string;
}

interface Mention {
    count: number;
    name: string;
}

export interface Collaboration {
    mention: string;
    timestamp: string;
}

export interface Followers {
    male: number;
    female: number;
}
