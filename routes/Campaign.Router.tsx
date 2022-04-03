import BriefDetailView from 'pages/campaign/BriefDetailView';
import CampaignDetailView from 'pages/campaign/CampaignDetailView';
import CreativeDetailView from 'pages/campaign/CreativeDetailView';
import EditCreative from 'pages/campaign/EditCreative';
import AddInfluencersView from 'pages/create_campaign/AddInfluencersView';
import BriefInfluencersView from 'pages/create_campaign/BriefInfluencersView';
import CreateCampaignView from 'pages/create_campaign/CreateCampaignView';
import { EditCampaignView } from 'pages/create_campaign/EditCampaignView';
import FourOhFour from 'pages/FourOhFour';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PrivateRouteInfluencer } from './PrivateRouteInfluencer';

export class CampaignRouter extends React.Component {
    render() {
        return (
            <Switch>
                <PrivateRoute
                    path="/create-campaign"
                    exact
                    component={CreateCampaignView}
                />
                {/* todo: fix the path name */}
                <PrivateRoute
                    path="/create-campaign/add-influencers"
                    component={AddInfluencersView}
                />
                {/* <PrivateRoute path='/create-campaign/brief/:influencer/:name' component={BriefInfluencers} /> */}
                <PrivateRoute
                    path="/create-campaign/edit-brief"
                    component={BriefInfluencersView}
                />
                <PrivateRoute
                    path="/create-campaign/brief/default"
                    component={BriefInfluencersView}
                />
                <PrivateRoute
                    path="/campaign/:campaign_id/edit"
                    exact
                    component={EditCampaignView}
                />
                <PrivateRoute
                    path="/campaign/:campaign_id"
                    exact
                    component={CampaignDetailView}
                />
                <PrivateRoute
                    path="/campaign/:campaign_id/:influencer_id/:invitation_token?"
                    component={BriefDetailView}
                />
                <PrivateRouteInfluencer
                    path="/creative/:creative_id/edit"
                    component={EditCreative}
                />
                <PrivateRoute
                    path="/creative/:creative_id"
                    component={CreativeDetailView}
                />
                <Route component={FourOhFour} />
            </Switch>
        );
    }
}
