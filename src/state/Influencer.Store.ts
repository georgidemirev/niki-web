import { action, observable } from 'mobx';
import api from '../api';
import { InfluencerProfile } from '../models/interfaces';

export class InfluencerStore {
    @observable currentInfluencer: InfluencerProfile | undefined;

    constructor() {
        this.currentInfluencer = undefined;
    }

    @action setInfluencer(influencer) {
        this.currentInfluencer = influencer;
    }

    fetchInfluencerById = async (influencerId) => {
        try {
            const response = await api.get(
                `/influencer/single/${influencerId}`
            );
            const { data } = response;
            this.setInfluencer(data.influencer);
        } catch (error) {
            // TODO: Error Handling
        }
    };
}
