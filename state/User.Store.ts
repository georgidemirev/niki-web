import Cookies from 'js-cookie';
import { action, observable } from 'mobx';
import { UpdateProfileForm } from '../models/classes';
import { ROLE } from '../models/Enum';
import { Account } from '../models/interfaces';
import { store } from './Store';
import api from '../api';
import i18n from '../localization/i18n';

export class UserStore {
    @observable user: Account | undefined;

    @action
    fetchUser = async () => {
        try {
            const response = await api.get('/users/me');
            this.user = response.data.user;
            // note: role should expire with token
            Cookies.set('user-role', response.data.user.role, { expires: 4 });

            if (this.user!.lang !== i18n.language) {
                store.setLanguage(this.user!.lang);
            }

            return response.data.user as Account;
        } catch (error) {
            await store.authStore.logOutUser();
        }
    };

    @action
    updateUser = async (form: UpdateProfileForm) => {
        try {
            await api.post('/users/update', form);
            await store.user.fetchUser();
        } catch (error: any) {
            store.errorMessage = error.response?.data.msg;
        }
    };

    toggleFavoriteInfluencer = async (influencerId) => {
        try {
            const response = await api.post(`/users/favorite/${influencerId}`);
            this.user = response.data.user;
            return this.user;
        } catch (error: any) {
            store.errorMessage = error.response?.data.msg;
        }
    };

    approveInfluencer = async (influencerId: string) => {
        try {
            const response = await api.post(
                `/admin/approve_influencer/${influencerId}`
            );
            return response;
        } catch (error: any) {
            store.errorMessage = error.response?.data.msg;
        }
    };

    disapproveInfluencer = async (influencerId: string) => {
        try {
            const response = await api.post(
                `/admin/deny_influencer/${influencerId}`
            );
            return response;
        } catch (error: any) {
            store.errorMessage = error.response?.data.msg;
        }
    };

    isInFavorites = (influencerId) =>
        !!store.user.user?.favorite_influencers?.find(
            (influencer) => influencer._id === influencerId
        );

    @action
    async connectToInstagram(invitationToken?: string, campaignId?: string) {
        try {
            if (this.user?.role === ROLE.INFLUENCER) {
                if (!this.user?.fbgraph_token) {
                    try {
                        if (invitationToken) {
                            const url = await this.generateInfluencerUrl(
                                invitationToken,
                                campaignId
                            );
                            return url;
                        }
                        const url = await this.generateInfluencerUrl();
                        return url;
                    } catch (error) {
                        throw new Error('Problem generating instagram url');
                    }
                }
            }
        } catch (error) {
            // TODO: Error Handling
        }
    }

    generateInfluencerUrl = async (
        invitationToken?: string,
        campaignId?: string
    ) => {
        try {
            if (invitationToken) {
                const invitationData = {
                    invitation_token: invitationToken,
                    campaign_id: campaignId,
                };
                const response = await api.post(
                    '/influencer/instagram/generate_url',
                    invitationData
                );
                return response?.data?.url;
            }
            const response = await api.post(
                '/influencer/instagram/generate_url',
                {}
            );
            return response?.data?.url;
        } catch (error: any) {
            const errMsg = error?.response?.data;
            if (errMsg) return Promise.reject(new Error(errMsg));
            return Promise.reject(new Error('Unauthorized'));
        }
    };

    saveAuthToken = async (code: string) => {
        const body = { code };
        try {
            const response = await api.post(
                '/influencer/instagram/store_token',
                body
            );
            await this.fetchUser();
            return response?.data?.success;
        } catch (error) {
            return false;
        }
    };

    get userRole() {
        return this.user?.role;
    }
}
