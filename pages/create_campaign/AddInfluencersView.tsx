import {
    Card,
    HBox,
    TextField,
    _Button as Button,
    _ErrorMessage as ErrorMessage,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Influencer } from 'models/classes';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

const shortid = require('shortid');

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

interface IInfluencer {
    name: string;
    email: string;
}

@observer
class AddInfluencersView extends React.Component<Props> {
    @observable influencer: IInfluencer = { name: '', email: '' };

    @action
    setInfluencerName = (event) => {
        const name = event.target.value;
        this.influencer.name = name;
    };

    @action
    setInfluencerEmail = (event) => {
        const email = event.target.value;
        this.influencer.email = email;
    };

    addInfluencer = async () => {
        const { t } = this.props;
        if (!this.influencer.name || !this.influencer.email) {
            store.campaignStore.errorMessage = `${t(
                'add_influencers.please_fields'
            )}`;
        } else {
            store.campaignStore.errorMessage = '';
        }

        if (!store.campaignStore.errorMessage) {
            const newInfluencer = new Influencer();
            newInfluencer.tempID = shortid.generate(); // just for path
            newInfluencer.name = this.influencer.name;
            newInfluencer.email = this.influencer.email;

            store.campaignStore.influencer = newInfluencer;

            const campaignId = this.props.location?.state?.campaignId;
            this.props.history.push('/create-campaign/edit-brief', {
                campaignId,
            });
        }
    };

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered create-campaign gradient-container">
                <Card className="create-campaign__card">
                    <span className="title bold gradient">
                        {t('add_influencers.invite_influencer')}
                    </span>
                    <HBox
                        style={{ width: '100%', marginTop: '3.7%' }}
                        align="between"
                    >
                        <TextField
                            style={{ maxWidth: '48%' }}
                            className={
                                !this.influencer.name &&
                                store.campaignStore.errorMessage
                                    ? 'errorField'
                                    : ''
                            }
                            label={t('add_influencers.influencer_name')}
                            placeholder={t('add_influencers.name_placeholder')}
                            onChange={(event) => this.setInfluencerName(event)}
                        />
                        <TextField
                            style={{ maxWidth: '48%' }}
                            className={
                                !this.influencer.email &&
                                store.campaignStore.errorMessage
                                    ? 'errorField'
                                    : ''
                            }
                            label={t('add_influencers.influencer_email')}
                            placeholder={t('add_influencers.email_placeholder')}
                            onChange={(event) => this.setInfluencerEmail(event)}
                        />
                    </HBox>
                    <ErrorMessage
                        errorMessage={store.campaignStore.errorMessage}
                    />
                    <HBox style={{ width: '100%' }} align="right">
                        <Button
                            text={t('add_influencers.next_step')}
                            onClick={() => this.addInfluencer()}
                        />
                    </HBox>
                </Card>
            </div>
        );
    }
}

const wrapped = withRouter(AddInfluencersView);

export default withTranslation()(wrapped);
