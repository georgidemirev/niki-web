import { LanguageCode } from '../../localization/constants';

export class UpdateProfileForm {
    name?: string;

    email?: string;

    phone_number?: string;

    lang?: LanguageCode;

    about?: string;

    topics?: string[];

    categories?: string[];

    country?: string;

    city?: string;

    post_price?: number;

    story_price?: number;

    video_price?: number;

    constructor() {
        this.name = '';
        this.email = '';
        this.phone_number = '';
        this.about = '';
        this.topics = [];
        this.categories = [];
        this.country = '';
        this.city = '';
        this.post_price = 0;
        this.story_price = 0;
        this.video_price = 0;
    }
}
