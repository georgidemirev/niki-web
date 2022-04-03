import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import {
    DropDownOutlined,
    HBox,
    Icon,
    IconTypes,
    TextField,
    VBox,
    _Button as Button,
    _Checkbox as Checkbox,
} from '../../../components/common';
import { store } from '../../../state/Store';
import { Country } from '../../../models/Types';
import { getInfluencerCategories } from '../../../service/local/data/categories';
import './InfluencersFilter.css';
import { getCountries } from '../../../service/local/data/countries';
import { getChannels } from '../../../service/local/data/channels';

interface InfluencersFilterProps {
    onCloseModal?: () => void;
    onClear?: () => void;
}

const InfluencerFilter: React.FC<InfluencersFilterProps> = observer((props) => {
    const { t } = useTranslation();

    useEffect(() => {
        store.marketPlaceStore.filterStore.country =
            (store.user.user?.country as Country) || t('marketplace.any');
    }, []);

    const onCountryChange = (event: any) => {
        store.marketPlaceStore.filterStore.country = event.target.value;
    };

    const toggleGender = (gender: string) => {
        switch (gender) {
            case 'male':
                store.marketPlaceStore.filterStore.gender = 'male';
                store.marketPlaceStore.filterStore.maleChecked =
                    !store.marketPlaceStore.filterStore.maleChecked;
                store.marketPlaceStore.filterStore.anyChecked = false;
                store.marketPlaceStore.filterStore.femaleChecked = false;
                break;
            case 'female':
                store.marketPlaceStore.filterStore.gender = 'female';
                store.marketPlaceStore.filterStore.femaleChecked =
                    !store.marketPlaceStore.filterStore.femaleChecked;
                store.marketPlaceStore.filterStore.maleChecked = false;
                store.marketPlaceStore.filterStore.anyChecked = false;
                break;
            case 'any':
                store.marketPlaceStore.filterStore.gender = 'any';
                store.marketPlaceStore.filterStore.anyChecked =
                    !store.marketPlaceStore.filterStore.anyChecked;
                store.marketPlaceStore.filterStore.maleChecked = false;
                store.marketPlaceStore.filterStore.femaleChecked = false;
                break;
            default:
        }
    };

    const toggleNotConnected = () => {
        store.marketPlaceStore.filterStore.notConnected =
            !store.marketPlaceStore.filterStore.notConnected;
    };

    const toggleNotApprove = () => {
        store.marketPlaceStore.filterStore.notApproved =
            !store.marketPlaceStore.filterStore.notApproved;
    };

    return (
        <VBox borderbox className="searchForm">
            <div className="" style={{ width: '100%' }}>
                <HBox
                    fullwidth
                    className="title__hbox"
                    align="between"
                    valign="center"
                >
                    <span className="subtitle bold">
                        {t('marketplace.filter_by')}
                    </span>
                    <span
                        className="web text bright"
                        onClick={props?.onClear}
                        style={{ cursor: 'pointer' }}
                    >
                        {t('marketplace.clear')}
                    </span>
                    <div className="filter-close" onClick={props?.onCloseModal}>
                        <Icon
                            icon={IconTypes.close}
                            size={15}
                            color="rgba(60, 63, 68, .6)"
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </HBox>
            </div>
            <TextField
                icon={IconTypes.search}
                placeholder={t('marketplace.search_placeholder')}
                value={store.marketPlaceStore.filterStore.search}
                iconStyle={{
                    backgroundImage:
                        'linear-gradient(to right, #D100FF, #8D06FF)',
                }}
                containerStyle={styles.searchFieldContainerStyle}
                onChange={(event) => {
                    store.marketPlaceStore.filterStore.search =
                        event.target.value;
                    store.marketPlaceStore.filteredInfluencers =
                        store.marketPlaceStore.filteredByName;
                }}
            />

            <TextField
                label={t('marketplace.keyword')}
                placeholder={t('marketplace.keyword')}
                value={store.marketPlaceStore.filterStore.keyword}
                containerStyle={styles.searchFieldContainerStyle}
                onChange={(event) => {
                    store.marketPlaceStore.filterStore.keyword =
                        event.target.value;
                }}
            />
            <DropDownOutlined
                label={t('marketplace.category')}
                style={{
                    ...styles.dropDownContainerStyle,
                    ...styles.searchFieldContainerStyle,
                }}
                menuItems={getInfluencerCategories()}
                labelId="categories"
                value={store.marketPlaceStore.filterStore.category}
                placeholder={t('marketplace.any')}
                onChange={(event) => {
                    store.marketPlaceStore.filterStore.category =
                        event.target.value;
                }}
            />
            <DropDownOutlined
                label={t('marketplace.channel')}
                style={{
                    ...styles.dropDownContainerStyle,
                    ...styles.searchFieldContainerStyle,
                }}
                menuItems={getChannels().map((channel) => ({
                    value: channel.source,
                    text: channel.name || channel.source,
                }))}
                value={store.marketPlaceStore.filterStore.channel}
                placeholder={t('marketplace.any')}
                labelId="channels"
                onChange={(event) => {
                    store.marketPlaceStore.filterStore.channel =
                        event.target.value;
                }}
            />

            <DropDownOutlined
                label={t('registration.country.label')}
                style={{
                    ...styles.dropDownContainerStyle,
                    ...styles.searchFieldContainerStyle,
                }}
                menuItems={getCountries()}
                value={store.marketPlaceStore.filterStore.country}
                placeholder={t('marketplace.any')}
                labelId="country"
                onChange={onCountryChange}
            />

            <VBox borderbox style={styles.searchFieldContainerStyle} fullwidth>
                <span className="label small" style={{ marginBottom: 0 }}>
                    {t('marketplace.audience_gender')}
                </span>
                <HBox
                    fullwidth
                    borderbox
                    align="between"
                    style={{ flexWrap: 'wrap' }}
                >
                    <Checkbox
                        label={
                            <span className="text">{t('marketplace.any')}</span>
                        }
                        checked={store.marketPlaceStore.filterStore.anyChecked}
                        onChange={(event) => toggleGender('any')}
                    />
                    <Checkbox
                        label={
                            <span className="text">
                                {t('marketplace.male')}
                            </span>
                        }
                        checked={store.marketPlaceStore.filterStore.maleChecked}
                        onChange={(event) => toggleGender('male')}
                    />
                    <Checkbox
                        label={
                            <span className="text">
                                {t('marketplace.female')}
                            </span>
                        }
                        checked={
                            store.marketPlaceStore.filterStore.femaleChecked
                        }
                        onChange={(event) => toggleGender('female')}
                    />
                </HBox>
            </VBox>
            <HBox
                fullwidth
                borderbox
                align="between"
                style={{ marginTop: '2vh' }}
            >
                {store.userIsAdmin && (
                    <Checkbox
                        label={
                            <span className="text">
                                {t('marketplace.not_connected')}
                            </span>
                        }
                        checked={
                            store.marketPlaceStore.filterStore.notConnected
                        }
                        onChange={(event) => toggleNotConnected()}
                    />
                )}
                <Button
                    text={t('marketplace.search')}
                    type="outlined"
                    onClick={() => {
                        store.marketPlaceStore.searchInfluencers();
                    }}
                />
            </HBox>
            <HBox
                fullwidth
                borderbox
                align="between"
                style={{ marginTop: '2vh' }}
            >
                {store.userIsAdmin && (
                    <Checkbox
                        label={
                            <span className="text">
                                {t('marketplace.not_approved')}
                            </span>
                        }
                        checked={store.marketPlaceStore.filterStore.notApproved}
                        onChange={(event) => toggleNotApprove()}
                    />
                )}
            </HBox>
        </VBox>
    );
});

export default InfluencerFilter;

const styles = {
    searchFieldContainerStyle: {
        marginTop: '7.4%',
        width: '100%',
    },

    dropDownContainerStyle: {
        width: '100%',
    },
};
