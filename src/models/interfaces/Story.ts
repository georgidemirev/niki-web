import { Publication } from '.';

export interface Story extends Publication {
    completed: boolean;
    exits: number;
    real_url: string;
    replies: number;
    story_id: string;
    taps_forward: number;
    thumbnail_url: string;
}
