import Cookies from 'js-cookie';
import { action, observable } from 'mobx';

import { Account } from '../models/interfaces';
import { UserRole } from '../models/Types';
import { AuthStore } from './Auth.Store';
import { CampaignStore } from './Campaign.Store';
import { InfluencerStore } from './Influencer.Store';
import { MarketPlaceStore } from './MarketPlace.Store';
import { UserStore } from './User.Store';
import i18n from '../localization/i18n';
import { LanguageCode } from '../localization/constants';

class Store {
    @observable private selectedTab = -100;

    @observable userIsLoggedIn = false;

    @observable isFetching = false;

    @observable errorMessage = '';

    @observable loadingCounter = 0;

    authStore = new AuthStore();

    user = new UserStore();

    campaignStore = new CampaignStore();

    marketPlaceStore = new MarketPlaceStore();

    influencerStore = new InfluencerStore();

    setLanguage(lang: LanguageCode): void {
        if (store.user.user && store.user.user.lang !== lang) {
            store.user.updateUser({ lang });
        }
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang);
    }

    @action setSelectedTab(index) {
        this.selectedTab = index;
    }

    @action
    startLoader() {
        this.loadingCounter += 1;
    }

    @action
    stopLoader() {
        if (this.loadingCounter > 0) {
            this.loadingCounter -= 1;
        }
    }

    initUser = () =>
        ({
            _id: '',
            name: '',
            email: '',
            role: undefined,
        } as Account);

    get selectedTabPanel() {
        return this.selectedTab;
    }

    get isAuthenticated() {
        this.userIsLoggedIn = !!Cookies.get('user-token');
        return !!Cookies.get('user-token') || '';
    }

    get userRole(): UserRole {
        return Cookies.get('user-role');
    }

    get userIsAdmin() {
        return this.user.user?.admin;
    }
}

export const store = new Store();
