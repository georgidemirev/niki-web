import { Publication } from '.';

export interface Post extends Publication {
    comments_count: number;
    engagement: number;
    engagement_rate: number;
    hashtags: string[];
    id: string;
    like_count: number;
    saved: number;
}
