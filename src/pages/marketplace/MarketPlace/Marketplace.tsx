import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { PaginatedList } from 'react-paginated-list';

import {
    Card,
    DropDown,
    DropDownOutlined,
    HBox,
    Spinner,
    _Button as Button,
} from '../../../components/common';
import InfluencerCard from '../../../components/common/InfluencerCard/InfluencerCard';
import { Campaign, DropDownSelectItem } from '../../../models/interfaces';
import { store } from '../../../state/Store';
import FilterHeader from '../FilterHeader';
import { FilterModal } from '../FilterModal/FilterModal';
import InfluencerFilter from '../InfluencersFilter/InfluencerFilter';
import './MarketPlace.css';

const Marketplace = observer(() => {
    const { t } = useTranslation();
    const history = useHistory();
    const campaignsItems: DropDownSelectItem[] = [];
    const marketStore = store.marketPlaceStore;
    const sortItemsDropDown = [
        { value: 'followers', text: t('marketplace.followers') },
        { value: 'eng_rate', text: t('marketplace.eng_rate') },
    ];

    const filterHeaderRef = React.createRef();

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    let campaigns: Campaign[] = [];
    let campaignId = '';
    let sortOption = sortItemsDropDown[0].value;

    useEffect(() => {
        store.influencerStore.currentInfluencer = undefined;
        if (marketStore.filteredInfluencers.length === 0) {
            marketStore.loadingInfluencers = true;
        }
        store.isFetching = true;
        loadCampaigns();
        loadInfluencers();
        campaignId = history.location?.state?.campaignId;
        store.setSelectedTab(1);
        if (store.userIsAdmin) {
            sortItemsDropDown.push({
                value: 'new',
                text: t('marketplace.newest'),
            });
        }

        return function cleanup() {
            const destination = history.location.pathname;
            if (!destination.match(/[/]influencer[/](\w+)/g)) {
                // path ==> /influencer/:id
                marketStore.currentPage = 1;
                store.marketPlaceStore.clearSearch();
            }
        };
    }, []);

    const loadInfluencers = async () => {
        await store.marketPlaceStore.loadInfluencers();
        if (marketStore.filteredInfluencers.length === 0) {
            marketStore.filteredInfluencers = marketStore.influencers.slice();
        }
        store.isFetching = false;
        marketStore.loadingInfluencers = false;
    };

    const loadCampaigns = async () => {
        await store.campaignStore.getAllCampaigns();
        campaigns = store.campaignStore.campaigns ?? [];
        campaigns?.forEach((campaign) => {
            const campaignItem = { value: campaign._id, text: campaign.title };
            campaignsItems.push(campaignItem);
        });

        store.isFetching = false;
    };

    const followersString = (totalFollowers) => {
        if (totalFollowers > 9999 && totalFollowers < 999999) {
            return `${(totalFollowers / 1000).toFixed(1)} k`;
        }
        return `${totalFollowers}`;
    };

    const pressInviteOtherBtn = () => {
        if (!campaignId) {
            setOpenModal(!openModal);
        } else {
            history.push('/create-campaign/add-influencers', {
                campaignId,
            });
        }
    };

    const toggleFilterModal = () => {
        setShowFilterModal(!showFilterModal);
    };

    const onPageChange = (page) => {
        window.scrollTo(0, 0);
        marketStore.currentPage = page;
    };

    return (
        <div className="App-Contant_wrapper">
            <div className="Marketplace">
                <div className="filterBy-container web">
                    <InfluencerFilter onClear={marketStore.clearSearch} />
                </div>
                <div className="hideBar__div mobile">
                    <FilterHeader
                        sortValue={sortOption}
                        dropDownSortOptions={sortItemsDropDown}
                        ref={filterHeaderRef as any}
                        onClickFilter={toggleFilterModal}
                        onClickSort={(e) => {
                            marketStore.sortInfluencers(e?.target?.value);
                        }}
                    />
                </div>
                <div className="infleuncers-container">
                    <div className="web">
                        {!marketStore.loadingInfluencers && (
                            <div className="marketplace-header">
                                <span className="title bold">{`${
                                    marketStore.filteredInfluencers?.length
                                } ${t('marketplace.influencers')}`}</span>
                                <div className="sortby-subheader__div">
                                    <HBox
                                        borderbox
                                        align="between"
                                        valign="center"
                                    >
                                        <span className="text light">
                                            {t('marketplace.sort_by')}: &nbsp;
                                        </span>
                                        <DropDown
                                            onChange={(value) => {
                                                marketStore.sortInfluencers(
                                                    value
                                                );
                                                sortOption = value;
                                            }}
                                            labelId="sortDropDId"
                                            menuItems={sortItemsDropDown}
                                            value={sortOption}
                                        />
                                    </HBox>
                                </div>
                            </div>
                        )}
                    </div>
                    <PaginatedList
                        paginatedListContainerClass="paglist__container"
                        list={marketStore.filteredInfluencers}
                        itemsPerPage={16}
                        isLoading={marketStore.loadingInfluencers}
                        loadingItem={() => <PaginatedListLoadingItem />}
                        currentPage={marketStore.currentPage}
                        onPageChange={onPageChange}
                        renderList={(list) => (
                            <>
                                {list.map((item, id) => {
                                    return (
                                        item !== undefined && (
                                            <div
                                                className="mp-influencer__card"
                                                key={id}
                                            >
                                                <InfluencerCard
                                                    title={item.name}
                                                    image={item.profile_picture}
                                                    subTitle="Instagram"
                                                    engRate={`${item.instagram_engagement_rate?.toFixed(
                                                        1
                                                    )}`}
                                                    followers={followersString(
                                                        item?.instagram_total_followers
                                                    )}
                                                    className="card"
                                                    type="discover"
                                                    onClick={() =>
                                                        history.push(
                                                            `/influencer/${item._id}`,
                                                            {
                                                                campaignId,
                                                            }
                                                        )
                                                    }
                                                    onToggleFavorite={() =>
                                                        store.user.toggleFavoriteInfluencer(
                                                            item?._id
                                                        )
                                                    }
                                                    isFavorite={store.user.isInFavorites(
                                                        item._id
                                                    )}
                                                />
                                            </div>
                                        )
                                    );
                                })}
                            </>
                        )}
                    />
                    <div className="no-influencers__conrainer">
                        <Card borderbox>
                            <HBox
                                borderbox
                                align="center"
                                valign="center"
                                fullwidth
                            >
                                <span className="text bold">
                                    {t('marketplace.looking_influencer')}
                                </span>
                                <Button
                                    marginLeft="1.5%"
                                    type="outlined"
                                    text={t('marketplace.invite')}
                                    onClick={() => pressInviteOtherBtn()}
                                    containerStyle={{ marginLeft: '3.7%' }}
                                />
                            </HBox>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                open={openModal}
                onEscapeKeyDown={() => setOpenModal(!openModal)}
            >
                <HBox style={{ height: '100%' }} align="center" valign="center">
                    <HBox
                        fullwidth
                        style={{
                            background: '#fff',
                            maxWidth: '50%',
                            padding: '1.3vw',
                        }}
                        valign="center"
                        align="center"
                    >
                        <DropDownOutlined
                            label="Please, select a campaign"
                            style={{ width: '100%', marginTop: '2vh' }}
                            menuItems={campaignsItems as DropDownSelectItem[]}
                            value={campaignId}
                            labelId="campaigns"
                            onChange={(event) => {
                                setOpenModal(!openModal);
                                history.push(
                                    '/create-campaign/add-influencers',
                                    { campaignId }
                                );
                            }}
                        />
                    </HBox>
                </HBox>
            </Modal>
            <FilterModal
                show={showFilterModal}
                onClose={() => {
                    setShowFilterModal(!showFilterModal);
                    store.marketPlaceStore.clearSearch();
                }}
            />
        </div>
    );
});

function PaginatedListLoadingItem() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '3.7%',
            }}
        >
            <Spinner />
        </div>
    );
}

export default Marketplace;
