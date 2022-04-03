import { SocialChannel } from 'models/interfaces';

export class RegistrationForm {
    name: string;

    email: string;

    phone_number: string;

    about: string;

    topics: string[];

    categories: string[];

    channels: SocialChannel[];

    password: string;

    gender: string;

    post_price: number;

    story_price: number;

    video_price: number;

    country: string;

    city: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.phone_number = '';
        this.about = '';
        this.topics = [];
        this.categories = [];
        this.channels = [];
        this.country = '';
        this.city = '';
        this.password = '';
        this.gender = '';
        this.post_price = 0;
        this.story_price = 0;
        this.video_price = 0;
    }
}
