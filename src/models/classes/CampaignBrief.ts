import { Status } from '../Types';

export class CampaignBrief {
    // name: string = ''
    // creativeTypes: string[] = []
    n_posts = 0;

    n_stories = 0;

    n_videos = 0;

    requirements = '';

    vision = '';

    attachments: any[] = [];

    hashtags: string[] = [];

    mentions: string[] = [];

    special_notes = '';

    status: Status = 'waiting';

    budget = 0;
}
