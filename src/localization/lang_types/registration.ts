import { Countries } from './countries';
import { Gender } from './gender';

export type RegisterTranslation = {
    registration: string;
    register: string;
    name: string;
    placeholder_name: string;
    email: string;
    placeholder_email: string;
    phone_number: string;
    placeholder_number: string;
    bio: string;
    placeholder_bio: string;
    topics: string;
    placeholder_topics: string;
    categories: string;
    channels: string;
    location: string;
    placeholder_location: string;
    country: Countries;
    city: string;
    average_price_for_one_post: string;
    average_price_for_one_story: string;
    average_price_for_one_video: string;
    gender: Gender;
    password: string;
    placeholder_password: string;
    terms_policy_accept: string;
    and: string;
    terms_of_use: string;
    privacy_policy: string;
    login_from_here: string;
    or: string;
    msg_social_channel: string;
    msg_category: string;
    msg_required_fields: string;
    msg_5_categories: string;
};