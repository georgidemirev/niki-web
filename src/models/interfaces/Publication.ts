export interface Publication {
    caption: string;
    impressions: number;
    media_type: string;
    media_url: string;
    mentions: string[];
    reach: number;
    timestamp: string;
    type?: 'story' | 'post';
}
