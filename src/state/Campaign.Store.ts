import api from 'api';
import { action, observable } from 'mobx';
import { Campaign, CampaignBrief, Creative, Influencer } from 'models/classes';
import { Campaign as ICampaign } from 'models/interfaces';
import dateFormatter from 'models/utils/Formatter';

export class CampaignStore {
    influencer: Influencer = new Influencer();

    @observable currentCampaign: ICampaign | undefined;

    @observable campaigns: ICampaign[] = [];

    @observable errorMessage = '';

    getAllCampaigns = async () => {
        try {
            const response = await api.get('/organization/campaign/all');

            if (response.data.success) {
                this.campaigns = response.data.campaigns;
            }
        } catch (error) {
            // TODO: Error Handling
        }
    };

    getAllInfluencerCampaigns = async () => {
        try {
            const response = await api.get('/influencer/campaign/all');

            if (response.data.success) {
                this.campaigns = response.data.campaigns;
            }
        } catch (error) {
            // TODO: Error Handling
        }
    };

    updateCampaign = async (campaign: Campaign, campaignId) => {
        const body = {
            title: campaign.title,
            hashtags: campaign.hashtags,
            target: campaign.target,
            budget: campaign.budget,
            mentions: campaign.mentions,
            start_date: dateFormatter.formatDate(
                new Date(campaign.dateRange.startDate),
                'yyyy-mm-dd'
            ),
            end_date: dateFormatter.formatDate(
                new Date(campaign.dateRange.endDate),
                'yyyy-mm-dd'
            ),
        };
        try {
            const response = await api.post(
                `/organization/campaign/${campaignId}/update`,
                body
            );
            return response.data;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    /* ***** Create campaign process methods ****** */
    createCampaign = async (campaign: Campaign) => {
        const body = {
            title: campaign.title,
            hashtags: campaign.hashtags,
            target: campaign.target,
            budget: campaign.budget,
            mentions: campaign.mentions,
            start_date: dateFormatter.formatDate(
                new Date(campaign.dateRange.startDate),
                'yyyy-mm-dd'
            ),
            end_date: dateFormatter.formatDate(
                new Date(campaign.dateRange.endDate),
                'yyyy-mm-dd'
            ),
        };
        try {
            const response = await api.post(
                '/organization/campaign/create',
                body
            );
            return response.data.campaign_id;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    // this endpoint is for organizations
    loadCampaign = async (campaignId) => {
        try {
            const response = await api.get(
                `/organization/campaign/${campaignId}`
            );
            this.currentCampaign = response.data.campaign;
            return response.data.campaign;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    createCampaignBrief = async (brief: CampaignBrief, campaignId) => {
        const body = {
            requirements: brief.requirements,
            vision: brief.vision,
            hashtags: brief.hashtags,
            mentions: brief.mentions,
            special_notes: brief.special_notes,
            n_posts: brief.n_posts,
            n_stories: brief.n_stories,
            n_videos: brief.n_videos,
            budget: brief.budget,
        };
        try {
            const response = await api.post(
                `/organization/campaign/${campaignId}/brief/create`,
                body
            );
            if (response.data.success) {
                return response;
            }
        } catch (error: any) {
            // TODO: Error Handling
        }
    };

    // this endpoint is for influencers
    loadInfluencerCampaign = async (campaignId) => {
        try {
            const response = await api.get(
                `/influencer/campaign/${campaignId}`
            );
            this.currentCampaign = response.data.campaign;
            return response.data.campaign;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    // this endpoint is for organizations
    loadCreative = async (campaignId, influencerId, creativeId) => {
        try {
            const response = await api.get(
                `/organization/campaign/${campaignId}/influencer/${influencerId}/creative/${creativeId}`
            );
            return response.data.creative;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    // this endpoint is for influencers
    loadInfluencerCreative = async (camapignId, creativeId) => {
        try {
            const response = await api.get(
                `/influencer/campaign/${camapignId}/creative/${creativeId}`
            );
            return response.data.creative;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    uploadCreative = async (creative: Creative, campaignId, file) => {
        const data = new FormData();
        data.append('notes', creative.notes);
        data.append('post_text', creative.post_text);
        data.append('hashtags', JSON.stringify(creative.hashtags));
        data.append('caption_tags', JSON.stringify(creative.hashtags));
        data.append('mentions', JSON.stringify(creative.mentions));
        data.append('post_type', creative.post_type);
        data.append('post_date', creative.post_date);
        data.append('post_file', file, file.name);

        try {
            const response = await api.post(
                `/influencer/campaign/${campaignId}/add_creative`,
                data
            );
            return response;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    updateCreative = async (
        creative: Creative,
        campaignId,
        creativeId,
        file
    ) => {
        const data = new FormData();
        data.append('notes', creative.notes);
        data.append('post_text', creative.post_text);
        data.append('hashtags', JSON.stringify(creative.hashtags));
        data.append('caption_tags', JSON.stringify(creative.hashtags));
        data.append('mentions', JSON.stringify(creative.mentions));
        data.append('post_type', creative.post_type);
        data.append('post_date', creative.post_date);
        if (file) {
            data.append('post_file', file, file.name);
        }
        try {
            const response = await api.post(
                `/influencer/campaign/${campaignId}/creative/${creativeId}/update`,
                data
            );
            return response;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    inviteNewInfluencer = async (campaignId: string) => {
        const influencer = {
            name: this.influencer.name,
            email: this.influencer.email,
            ...this.influencer.campaignBrief,
        };

        try {
            await api.post(
                `/organization/campaign/${campaignId}/add_influencer/new`,
                influencer
            );
        } catch (error) {
            // TODO: Error Handling
        }
    };

    inviteExistingInfluencer = async (
        campaignId: string,
        influencerId: string
    ) => {
        const influencer = {
            email: this.influencer.email,
            ...this.influencer.campaignBrief,
        };

        try {
            await api.post(
                `/organization/campaign/${campaignId}/add_influencer/existing/${influencerId}`,
                influencer
            );
        } catch (error) {
            // TODO: Error Handling
        }
    };

    joinDecisionNewInfluencer = async (
        campaignId: string,
        invitationToken: string,
        influencerDecision: string
    ) => {
        const decision = {
            decision: influencerDecision,
        };

        try {
            await api.post(
                `/influencer/campaign/${campaignId}/influencer_invitation/new/${invitationToken}`,
                decision
            );
        } catch (error) {
            // TODO: Error Handling
        }
    };

    joinDecisionExistingInfluencer = async (
        campaignId: string,
        invitationToken: string,
        influencerDecision: string
    ) => {
        const decision = {
            decision: influencerDecision,
        };

        try {
            await api.post(
                `/influencer/campaign/${campaignId}/influencer_invitation/existing/${invitationToken}`,
                decision
            );
        } catch (error) {
            // TODO: Error Handling
        }
    };

    getInfluencerInvitationData = async (
        campaignId: string,
        invitationToken: string
    ) => {
        try {
            const response = await api.get(
                `/influencer/campaign/${campaignId}/influencer_invitation/${invitationToken}`
            );
            this.currentCampaign = response.data.campaign;
            return response.data.campaign;
        } catch (error) {
            // TODO: Error Handling
        }
    };

    @action
    deleteCampaign = async (campaignId: string) => {
        try {
            await api.post(`/organization/campaign/${campaignId}/delete`);

            this.campaigns = this.campaigns.filter(
                (campaign) => campaign._id !== campaignId
            );
        } catch (error) {
            // TODO: Error Handling
        }
    };
}
