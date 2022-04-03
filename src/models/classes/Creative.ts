import { Comment } from 'models/classes';

export class Creative {
    post_date: string;

    post_text: string;

    notes: string;

    hashtags: string[];

    status?: string;

    comments?: Comment[];

    mentions: string[];

    post_type: string;

    post_file: string;

    constructor() {
        this.post_date = '';
        this.post_text = '';
        this.notes = '';
        this.hashtags = [];
        this.mentions = [];
        this.post_type = 'image';
        this.post_file = '';
    }
}
