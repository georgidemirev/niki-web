import { ROLE } from 'models/Enum';
import { LanguageCode } from '../../localization/constants';
import { Influencer } from '.';

export interface Account {
    _id: string;
    admin?: 1 | 0;
    email: string;
    lang: LanguageCode;
    name: string;
    fbgraph_token?: string;
    country: string;
    favorite_influencers?: Influencer[]; // see if it is indeed Influencer or InfluencerProfile
    post_price?: number;
    profile_picture?: string;
    role?: ROLE;
    story_price?: number;
    video_price?: number;
}
