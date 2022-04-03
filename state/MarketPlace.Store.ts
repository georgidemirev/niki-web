import { action, observable } from 'mobx';
import i18n from 'i18next';

import api from '../api';
import { InfluencerProfile } from '../models/interfaces';
import { FollowerAgeType, SortType, Country } from '../models/Types';

export class MarketPlaceStore {
    filterStore = new FilterStore();

    @observable loadingInfluencers = false; // only when filtering influencers

    @observable influencers: InfluencerProfile[] = [];

    @observable filteredInfluencers: InfluencerProfile[] = [];

    @observable currentPage = 1;

    @observable sortOpt: SortType = 'followers';

    @action
    clearSearch = async () => {
        this.filteredInfluencers = this.influencers;
        this.filterStore.search = '';
        this.filterStore.category = 'Any';
        this.filterStore.channel = 'Any';
        this.filterStore.gender = '';
        this.filterStore.keyword = '';
        this.filterStore.anyChecked = false;
        this.filterStore.maleChecked = false;
        this.filterStore.femaleChecked = false;
        this.filterStore.notApproved = false;
        this.filterStore.notConnected = false;
        this.searchInfluencers();
        this.clickFirstPaginationPage();
    };

    clickFirstPaginationPage = async () => {
        (
            document?.querySelectorAll(
                '.infleuncers-container ul li'
            )[1] as HTMLElement
        )?.click();
    };

    @action
    loadInfluencers = async (newLoad?) => {
        if (!this.influencers.length || newLoad) {
            this.influencers = await this.filterInfluencers();
        }
        return this.influencers;
    };

    @action
    searchInfluencers = async () => {
        const { filterStore } = this;
        this.loadingInfluencers = true;

        const result = await this.filterInfluencers(
            this.sortOpt,
            filterStore.category,
            filterStore.channel,
            filterStore.keyword,
            filterStore.gender,
            filterStore.ageFollowers,
            filterStore.country,
            filterStore.notConnected,
            filterStore.notApproved
        );
        this.filteredInfluencers = result;

        this.loadingInfluencers = false;
        this.clickFirstPaginationPage();
        return result;
    };

    @action
    sortInfluencers = (option: SortType) => {
        this.sortOpt = option;
        this.searchInfluencers();
    };

    get filteredByName() {
        this.clickFirstPaginationPage();
        if (this.filterStore.search) {
            if (this.filteredInfluencers.length >= 0) {
                return this.filteredInfluencers.filter((i) =>
                    i.name
                        ?.toLowerCase()
                        .includes(this.filterStore.search.toLowerCase())
                );
            }
            this.influencers.filter((i) =>
                i.name
                    ?.toLowerCase()
                    .includes(this.filterStore.search.toLowerCase())
            );
        }
        return this.influencers;
    }

    filterInfluencers = async (
        sort?,
        category?,
        channel?,
        keyword?,
        gender?,
        age?,
        country?,
        notConnected?,
        notApproved?
    ) => {
        const params: any = {};
        if (sort) params.sort_by = sort;
        if (category !== 'Any') params.category = category;
        if (channel !== 'Any') params.channel = channel;
        if (keyword) params.keyword = keyword;
        if (!!gender && gender !== 'any') params.gender = gender;
        if (!!age && age !== 'Any') params.age = age;
        if (!!country && country !== i18n.t('marketplace.any'))
            params.country = country;
        if (notConnected) params.connected = 'unconnected';
        if (notApproved) params.unapproved = 'unapproved';

        try {
            const response = await api.post('/influencer/all', params);

            if (response.data.success) {
                return response.data.influencers;
            }
            // TODO: Error Handling
        } catch (error) {
            // TODO: Error Handling
        }
    };
}

class FilterStore {
    @observable search = '';

    @observable category = 'Any';

    @observable channel = 'Any';

    @observable ageFollowers: FollowerAgeType = 'Any';

    @observable country: Country = 'Any';

    @observable gender = '';

    @observable anyChecked = false;

    @observable maleChecked = false;

    @observable femaleChecked = false;

    @observable notConnected = false;

    @observable notApproved = false;

    @observable keyword = '';
}
