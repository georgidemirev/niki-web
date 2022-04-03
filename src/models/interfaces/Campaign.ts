import { Influencer, Organization } from 'models/interfaces';

export interface Campaign {
    _id: string;
    title: string;
    target: string;
    budget: string;
    start_date: string;
    end_date: string;
    influencers?: Influencer[];
    stories?: number;
    posts?: number;
    organization?: Organization;
}
