import { HBox, Spinner, VBox, _Button as Button } from 'components/common';
import InfluencerCard from 'components/common/InfluencerCard/InfluencerCard';
import {} from 'components/common/VBox';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Status } from 'models/Types';
import Formatter from 'models/utils/Formatter';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import './styles/CampaignDetailView/CampaignDetailView.css';

interface Props {
    history: any;
    match: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class CampaignDetailView extends React.Component<Props> {
    @observable campaign;

    @observable isChangingStatus = false;

    redirectTo = (path, influencer) => {
        if (!this.isChangingStatus) {
            // user clicks on the card
            // TODO: Switch owner by role later
            // store.briefStore.briefOwner = 'manager'
            this.props.history.push(path);
        } else {
            // user was changing the status to they shouldn't be redirected
            this.isChangingStatus = false;
        }
    };

    changeStatusForInfluencer = () => {
        this.isChangingStatus = true;
    };

    formatDateRange = (start, end) => {
        const startDate = Formatter.formatDate(new Date(start), 'mmm dd yyyy');
        const endDate = Formatter.formatDate(new Date(end), 'mmm dd yyyy');
        return `${startDate} - ${endDate}`;
    };

    addMoreInfluencers = () => {
        this.props.history.push('/marketplace', {
            campaignId: this.props.match.params.campaign_id,
        });
    };

    loadCampaign = async () => {
        const campaignId = this.props.match.params.campaign_id;
        this.campaign = await store.campaignStore.loadCampaign(campaignId);
    };

    componentDidMount() {
        store.isFetching = true;
        this.loadCampaign();
    }

    render() {
        const { t } = this.props;
        return (
            <VBox
                align="between"
                className="App-Content_wrapper gradient-container gradient-row-35 CampaignDetailView"
            >
                <div className="campaign-detail_title">
                    <span className="title bold"> {this.campaign?.title}</span>
                    <HBox
                        className="campaign_dateRange"
                        valign="center"
                        align="center"
                    >
                        <span className="text web">
                            {t('campaign_detail.date_range')} &nbsp;{' '}
                        </span>
                        <span className="text bold">
                            {`${Formatter.formatDate(
                                new Date(this.campaign?.start_date),
                                'mmm dd yyyy'
                            )} - ${Formatter.formatDate(
                                new Date(this.campaign?.end_date),
                                'mmm dd yyyy'
                            )}` ?? ''}
                        </span>
                    </HBox>
                </div>

                <div className="campaign-detail_buttons">
                    <span className="title bold">{`${
                        this.campaign?.influencers?.length > 0
                            ? this.campaign?.influencers?.length
                            : ''
                    } Influencer${
                        this.campaign?.influencers?.length === 1 ? '' : 's'
                    }`}</span>
                    <Button
                        text={t('campaign_detail.invite_influencers')}
                        onClick={() => this.addMoreInfluencers()}
                    />
                </div>
                {this.campaign?.influencers.length === 0 && (
                    <span className="text bright">
                        {t('campaign_detail.invite_message')}{' '}
                    </span>
                )}
                {this.campaign ? (
                    <div className="influencer-cards__container">
                        {this.campaign?.influencers?.map((item, index) => (
                            <div
                                className="influencer_card"
                                style={{ minWidth: '17%' }}
                                /* onClick={() => this.redirectTo(`/campaign/${this.campaign._id}/${item._id}`, item)} */ key={
                                    index
                                }
                            >
                                <InfluencerCard
                                    className="animate__animated animate__fadeIn"
                                    onClick={() =>
                                        this.redirectTo(
                                            `/campaign/${this.campaign._id}/${item._id}`,
                                            item
                                        )
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        animation: 'fadeIn',
                                        animationDuration: `${2}s`,
                                    }}
                                    type="campaign"
                                    title={item.name}
                                    image={item.influencer.profile_picture}
                                    subTitle="Instagram"
                                    budget={item?.budget}
                                    posts={item?.n_posts?.toString()}
                                    stories={item?.n_stories?.toString()}
                                    videos={item?.n_videos?.toString()}
                                    status={item?.status as Status}
                                    // onToggleFavorite={() => store.userStore.toggleFavoriteInfluencer(item?._id)}
                                    // isFavorite={store.userStore.isInFavorites(item._id)}
                                    // onChangeStatus={(status) => { this.changeStatusForInfluencer(status, item) }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <HBox fullwidth align="center" valign="center">
                        {' '}
                        <Spinner />{' '}
                    </HBox>
                )}
            </VBox>
        );
    }
}

const wrapped = withRouter(CampaignDetailView);

export default withTranslation()(wrapped);

/* const styles = {
	gridContainer: {
		display: 'grid',
		gridTemplateColumns: '25% 25% 25% 25%'
	},
	titleHboxStyle: {
		width: '100%',
		// marginBottom: '6vh',
		paddingTop: '6vh',
		paddingBottom: '6vh',
		borderBottom: '1px solid rgba(60, 63, 68, 0.1)'
	}
} */
