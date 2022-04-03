import { VBox } from 'components/common';
import InfluencerCard from 'components/common/InfluencerCard/InfluencerCard';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Status } from 'models/Types';
import React from 'react';
import { store } from 'state/Store';

interface FavProps {
    history: any;
    match: any;
    location: any;
    staticContext: any;
}

@observer
export class Favorites extends React.Component<FavProps> {
    @observable isChangingStatus = false;

    @observable favorites = [] as any;

    componentDidMount() {
        store.setSelectedTab(2);
        store.user.fetchUser().then((user) => {
            this.favorites = [...(user?.favorite_influencers as any[])];
        });
    }

    onRemoveFromFavorites = (itemId, index = 0) => {
        store.user.toggleFavoriteInfluencer(itemId);
        this.favorites.splice(index, 1);
    };

    followersString(totalFollowers) {
        if (totalFollowers > 9999 && totalFollowers < 999999) {
            return `${(totalFollowers / 1000).toFixed(1)} k`;
        }
        return `${totalFollowers}`;
    }

    render() {
        return (
            <VBox
                align="between"
                className="App-Content_wrapper gradient-container gradient-row-35 CampaignDetailView"
            >
                {this.favorites.length === 0 && (
                    <span className="text">
                        No influencers added to favorites
                    </span>
                )}
                <div className="influencer-cards__container">
                    {this.favorites?.map((item, index) => (
                        <div
                            className="influencer_card"
                            style={{ minWidth: '17%' }}
                        >
                            <InfluencerCard
                                className="animate__animated animate__fadeIn"
                                onClick={() =>
                                    this.props.history.push(
                                        `/influencer/${item._id}`
                                    )
                                }
                                style={{
                                    cursor: 'pointer',
                                    animation: 'fadeIn',
                                    animationDuration: '1s',
                                }}
                                type="discover"
                                title={item.name}
                                image={item.profile_picture}
                                subTitle="Instagram"
                                budget={item?.budget}
                                posts={item?.n_posts?.toString()}
                                stories={item?.n_stories?.toString()}
                                videos={item?.n_videos?.toString()}
                                status={item?.status as Status}
                                onToggleFavorite={() =>
                                    this.onRemoveFromFavorites(item?._id, index)
                                }
                                shouldFavouriteToggle={false}
                                isFavorite
                                engRate={`${item.instagram_engagement_rate?.toFixed(
                                    1
                                )}`}
                                followers={this.followersString(
                                    item?.instagram_total_followers
                                )}
                            />
                        </div>
                    ))}
                </div>
            </VBox>
        );
    }
}
