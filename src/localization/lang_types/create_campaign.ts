import { Objective } from './objective';

export type CreateCampaignTranslation = {
    create_campaign: string;
    campaign_name: string;
    tracking_dates: string;
    objective_title: string;
    budget: string;
    date_placeholder: string;
    objective_placeholder: string;
    budget_placeholder: string;
    objective: Objective;
    error_message: string;
    edit_campaign: string;
    update_campaign: string;
    date_range: string;
    name_placeholder: string;
};
