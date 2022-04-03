import { _Button as Button } from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Campaign } from 'models/interfaces';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';
import CampaignsTable from './table/CampaignsTable';
import './table/CampaignsTable.css';

interface Props {
    history: any;
    match: any;
    lcation: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class CampaignsTabView extends React.Component<Props> {
    numberCampaigns = 1;

    @observable campaigns: Campaign[] = [];

    state = {
        message: '',
    };

    redirectTo = (path) => {
        this.props.history.push(path);
    };

    @action loadCampaigns = async () => {
        if (store.userRole === 'influencer') {
            await store.campaignStore.getAllInfluencerCampaigns();
        } else {
            await store.campaignStore.getAllCampaigns();
        }
        this.campaigns = [...store.campaignStore.campaigns];
        store.isFetching = false;
    };

    onDeleteCampaign = (campaignId) => {
        this.campaigns = this.campaigns.filter(
            (campaign) => campaign._id !== campaignId
        );
    };

    componentDidMount() {
        store.isFetching = true;
        this.loadCampaigns();
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="campaigns-title__tabpanel">
                    <span className="title bold">
                        {`${this.campaigns?.length} ${
                            this.campaigns.length === 1
                                ? t('dashboard.campaign')
                                : t('dashboard.campaign_pl')
                        }`}
                    </span>
                    {store.userRole === 'influencer' ? (
                        <Button
                            text={t('dashboard.go_to_profile')}
                            onClick={() =>
                                this.redirectTo(
                                    `/influencer/${store.user.user?._id}`
                                )
                            }
                        />
                    ) : null}
                    {store.userRole !== 'influencer' && (
                        <Button
                            text={t('dashboard.new_campaign')}
                            onClick={() => this.redirectTo('/create-campaign')}
                        />
                    )}
                    {/* // store.userStore.user?.fbgraph_token === '' ?
						// 	< Button text='Connect to Instagram' onClick={() => this.submit()} />
						// 	 */}
                </div>
                {
                    this.campaigns.length === 0 ? (
                        store.userRole === 'influencer' ? (
                            <span className="text bright">
                                {t('dashboard.message_influencer')}{' '}
                            </span>
                        ) : (
                            <span className="text bright">
                                {t('dashboard.message_manager')}{' '}
                            </span>
                        )
                    ) : (
                        <CampaignsTable
                            data={this.campaigns}
                            message={this.state.message}
                            onDeleteCampaign={(campId) =>
                                this.onDeleteCampaign(campId)
                            }
                        />
                    )
                    // <Table data={this.campaigns} />
                    // :
                    // <div style={{ display: 'flex', justifyContent: 'center', minHeight: '35vh', alignItems: 'center' }}>
                    // 	<Spinner />
                    // </div>
                }
            </div>
        );
    }
}

const wrapped = withRouter(CampaignsTabView);

export default withTranslation()(wrapped);
