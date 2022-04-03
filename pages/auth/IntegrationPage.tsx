import { Spinner } from 'components/common';
import React from 'react';
import { store } from 'state/Store';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
}
export class IntegrationPage extends React.Component<Props> {
    async componentDidMount() {
        store.errorMessage = '';
        let authToken = '';
        let invitationToken = '';
        let campaignId = '';

        if (this.props.location.search.split('&state=')[1]) {
            authToken = this.props.location.search
                .split('&state=')[0]
                .split('?code=')[1];
            invitationToken = this.props.location.search
                .split('&state=')[1]
                .split('%2C')[1];
            campaignId = this.props.location.search
                .split('&state=')[1]
                .split('%2C')[0];
        } else {
            authToken = this.props.location.search.split('?code=')[1];
        }

        try {
            await store.user.saveAuthToken(authToken);

            if (store.user.user?.fbgraph_token) {
                setTimeout(() => {
                    store.userIsLoggedIn = true;
                }, 5000);
                if (!!invitationToken && !!campaignId) {
                    this.redirectToCampaignPage(invitationToken, campaignId);
                } else {
                    this.redirectToHome();
                }
            } else if (!!invitationToken && !!campaignId) {
                this.redirectToIntegrationPage(invitationToken, campaignId);
            } else {
                this.redirectToIntegrationPage();
            }
        } catch (error) {
            // TODO: Error Handling
        }
    }

    redirectToHome = () => {
        setTimeout(() => {
            this.props.history.replace('/home/dashboard');
        }, 1000);
    };

    redirectToCampaignPage = (invitationToken, campaignId) => {
        setTimeout(() => {
            this.props.history.replace(
                `/campaign/${campaignId}/${store.user.user?._id}/${invitationToken}`
            );
        }, 1000);
    };

    redirectToIntegrationPage = (invitationToken?, campaignId?) => {
        setTimeout(() => {
            if (!!invitationToken && !!campaignId) {
                this.props.history.replace(
                    `/influencer_connect/${invitationToken}/${campaignId}`
                );
            } else {
                this.props.history.replace('/influencer_connect');
            }
        }, 1000);
    };

    render() {
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <Spinner />
            </div>
        );
    }
}
