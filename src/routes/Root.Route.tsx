import { AuthPage } from 'pages/auth/AuthPage';
import { ChangePasswordSuccess } from 'pages/auth/ChangePasswordSuccess';
import { ForgotPasswordSuccess } from 'pages/auth/ForgotPasswordSuccess';
import { IntegrationPage } from 'pages/auth/IntegrationPage';
import ConnectInstagramStartPage from 'pages/ConnectInstagramStartPage';
import ActivateOrganization from 'pages/create_organisation/ActivateOrganization';
import CreateOrganization from 'pages/create_organisation/CreateOrganization';
import CreateOrganizationSuccess from 'pages/create_organisation/CreateOrganizationSuccess';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { Favorites } from 'pages/favorites/Favorites';
import { Home } from 'pages/Home';
import InfluencerProfilePage from 'pages/influencers/profile_page/InfluencerProfilePage';
import InvitationStart from 'pages/InvitationStart';
import Marketplace from 'pages/marketplace/MarketPlace/Marketplace';
import { UserProfilePage } from 'pages/profile/UserProfilePage';
import TermsOfUse from 'pages/register/Conditions';
import { PrivacyPage } from 'pages/register/Privacy';
import RegistrationSuccess from 'pages/register/SuccessRegistration';
import Support from 'pages/Support';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CampaignRouter } from './Campaign.Router';
import { PrivateRoute } from './PrivateRoute';
import { PrivateRouteInfluencer } from './PrivateRouteInfluencer';
import { PrivateRouteManager } from './PrivateRouteManager';

export class Root extends React.Component {
    render() {
        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/home/dashboard" />}
                />
                <Route
                    path="/register/:invitation_token?/:campaign_id?"
                    component={AuthPage}
                />
                <Route
                    path="/success/:invitation_token?/:campaign_id?"
                    component={RegistrationSuccess}
                />
                <Route path="/privacy_policy" component={PrivacyPage} />
                <Route path="/terms_of_use" component={TermsOfUse} />
                <Route
                    path="/login/:invitation_token?/:campaign_id?"
                    component={AuthPage}
                />
                <Route
                    path="/invitation/start/:invitation_token/:campaign_id"
                    component={InvitationStart}
                />
                <Route
                    path="/forgot_password/:forgot_password_token"
                    component={AuthPage}
                />
                <Route path="/forgot_password" component={AuthPage} />
                <Route
                    path="/forgot_password_success"
                    component={ForgotPasswordSuccess}
                />
                <PrivateRouteManager
                    path="/marketplace"
                    component={Marketplace}
                />
                <PrivateRouteManager
                    path="/auth/create_account/organization"
                    component={CreateOrganization}
                />
                <PrivateRouteManager
                    path="/auth/create_account/activate"
                    component={ActivateOrganization}
                />
                <PrivateRouteManager
                    path="/create_organization_success"
                    component={CreateOrganizationSuccess}
                />
                <PrivateRouteManager path="/favorites" component={Favorites} />
                <PrivateRouteInfluencer
                    path="/influencer/instagram_integration"
                    component={IntegrationPage}
                />
                <Route
                    path="/influencer/:influencer_id"
                    component={InfluencerProfilePage}
                />
                <PrivateRoute path="/home" exact component={Home} />
                <PrivateRoute path="/home/dashboard" component={Dashboard} />
                <PrivateRoute path="/home/support" component={Support} />
                <PrivateRoute
                    path="/influencer_connect/:invitation_token?/:campaign_id?"
                    exact
                    component={ConnectInstagramStartPage}
                />
                <PrivateRoute
                    path="/token/update"
                    exact
                    component={ConnectInstagramStartPage}
                />
                <PrivateRoute
                    path="/home/account"
                    component={UserProfilePage}
                />
                <PrivateRoute path="/change_password" component={AuthPage} />
                <PrivateRoute
                    path="/change_password_success"
                    component={ChangePasswordSuccess}
                />
                <CampaignRouter />
            </Switch>
        );
    }
}
