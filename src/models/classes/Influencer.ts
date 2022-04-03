import { CampaignBrief } from 'models/classes';

export class Influencer {
    tempID: string;

    name: string;

    email: string;

    campaignBrief: CampaignBrief;

    budget?: string;

    constructor() {
        this.tempID = '';
        this.name = '';
        this.email = '';
        this.campaignBrief = new CampaignBrief();
        this.budget = '';
    }
}
